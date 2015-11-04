import _ from 'lodash';
import Bacon from 'baconjs';
import companies from '../models/companies';

class AbstractField{
  // TODO
  // get path(){
  //   console.log(this.key)
  //   if(!this.parent) return '';
  //   return `${this.parent.path}.${this.key}`;
  // }
}

export class Formo extends AbstractField{
  constructor(fields){
    super('', fields);
    this.fields = initFields(fields, this);
    this.submitBus = new Bacon.Bus();
    this.cancelBus = new Bacon.Bus();
    this.state = combineFields(this.fields);
    this.submitted = this.state.sampledBy(this.submitBus);
    this.cancelled = this.state.sampledBy(this.cancelBus, (state, cancelOptions) => {
        state.cancelOptions = cancelOptions;
        state.hasBeenModified = this.hasBeenModified(state);
        return state;
      }
    );
  }

  hasBeenModified(state){
    return _.any(state, (subState, name) => {
      return _.isObject(subState) && 'value' in subState && this.field(name).hasBeenModified(subState);
    });
  }
   
  field(path){
    return _.inject(path.split('.'), function(o, p){return o && o[p]}, this.fields);
  }

  reset(){
    _.each(this.fields, field => field.reset());
  }

  submit(){
    this.submitBus.push(true);
  }

  cancel(options){
    this.cancelBus.push(options);
  }

  toJS(state){
    let res = {};
    _.each(state, (subState, name) => {
      if(_.isObject(subState) && 'value' in subState) res[name] = subState.value;
    }); 
    return res;
  }
}

export class Field{
  constructor(name, schema){
    this.schema = schema;
    this.key = name;

    this.hasNewValue= new Bacon.Bus();
    this.doReset = new Bacon.Bus();

    let hasValue = this.hasNewValue;
    let ajaxResponse = new Bacon.Bus();
    let isLoading = new Bacon.Bus();

    if(this.schema.valueChecker){
      let stream = hasValue.throttle(this.schema.valueChecker.throttle || 100);
      hasValue = stream.flatMap( data => {
        let ajaxRequest = Bacon.fromPromise(this.schema.valueChecker.checker(data.value));
        isLoading.push(true);
        return Bacon.constant(data).combine(ajaxRequest, (data, isValid) => {
            isLoading.push(false);
            if(!isValid) data.error = this.schema.valueChecker.error || 'Wrong Input!';
            return data;
          })
      });
    }

    this.state = Bacon.update(
      {
        value: this.schema.defaultValue,
        domainValues: this.schema.domainValues,
        error: this.checkError(this.schema.defaultValue),
        canSubmit: !this.checkError(this.schema.defaultValue),
        isLoading: false,
      },
      this.doReset, (state, x) => {
        return {
          value: this.schema.defaultValue,
          domainValues: this.schema.domainValues,
          error: this.checkError(this.schema.defaultValue),
          canSubmit: !this.checkError(this.schema.defaultValue),
          isLoading: false,
        }
      },
      isLoading, (state, isLoading) => {
        state.isLoading = isLoading;
        state.canSubmit = !(state.isLoading || state.error);
        return state;
      },
      hasValue, (state, data) => {
        if(this.schema.valueChecker){
          state.value = data.value;
          state.error = data.error;
        }else{
          if(this.checkValue(data.value)){
            state.value = data.value;
            state.error = undefined;
          }else{
            state.value = data.value;
            state.error = this.getError(data.value) 
          }
        }
        state.canSubmit = !(state.isLoading || state.error);
        return state;
      },
    );
  }

  hasBeenModified(state){
    return state.value !== this.defaultValue;
  }

  checkValue(value){
    if(this.isNull(value)) return !this.isRequired();
    if(!this.checkPattern(value)) return false
    return true;
  }

  checkError(value){
    if(!this.checkValue(value)) return this.getError(value);
  }

  checkPattern(value){
    if(this.type === 'text') return true;
    return String(value).match(this.getPattern());
  }

  get defaultValue(){
    return this.schema.defaultValue;
  }

  get label(){
    return this.schema.label;
  }

  get type(){
    return this.schema.type;
  }

  get pattern(){
    return this.schema.pattern;
  }

  getError(value){
    if(this.isNull(value) && this.isRequired()) return "Input required";
    if(this.pattern) return "Input doesn't match pattern!"
    switch(this.type){
      case 'number':
        return "Input is not a number!";
      case 'integer':
        return "Input is not an integer!";
    }
    return "Wrong input!";
  }

  htmlType(){
    switch(this.type){
      case 'number':
      case 'integer':
        return 'text';
      case 'color': return 'color';
      case 'url': return 'url';
      default: return 'text';
    }
  }

  getPattern(){
    return this.pattern || {
        number: /^[0-9]*(\.[0-9]+)?$/
      , integer: /^[0-9]+$/ 
    }[this.type];
  }

  isNull(value){
    return _.isUndefined(value) || value === "";
  }


  setValue(value){
    this.hasNewValue.push({value: value});
  }

  reset(){
    this.doReset.push('reset');
  }

  isRequired(){
    return this.schema.required;
  }

  toJS(state){
    return state.value;
  }

}


export class MultiField extends AbstractField{
  constructor(name, fields){
    super(name, fields);
    this.key = name;
    this.fields = initFields(fields, this);
    this.state = combineFields(this);
  }

  reset(){
    _.each(this.fields, field => field.reset());
  }

  hasBeenModified(state){
    return _.any(state, (subState, name) => {
      return _.isObject(subState) && 'value' in subState && this.field(name).hasBeenModified(subState);
    });
  }

  field(path){
    return _.inject(path.split('.'), function(o, p){return o && o[p]}, this.fields);
  }

  toJS(state, root){
    let res = {};
    _.each(state, (subState, name) => {
      res[name] = field.toJS(subState);
    }); 
    return res;
  }

}

export class FieldGroup extends AbstractField{
  constructor(name, fields){
    super(name, fields);
    this.key = name;
    this.fields = initFields(fields, this);
    this.state = combineFields(this);
  }

  reset(){
    _.each(this.fields, field => field.reset());
  }

  hasBeenModified(state){
    return _.any(state, (subState, name) => {
      return _.isObject(subState) && 'value' in subState && this.field(name).hasBeenModified(subState);
    });
  }

  field(path){
    return _.inject(path.split('.'), function(o, p){return o && o[p]}, this.fields);
  }

  toJS(state){
    let res = {};
    _.each(state, (subState, name) => {
      res[name] = field.toJS(subState);
    }); 
    return res;
  }

}

function initFields(fields, parent){
  let data = {};
  for(let field of fields){
    field.parent = parent;
    data[field.key] = field;
  }
  return data;
}

function combineFields(fields){
  let res = _.chain(fields).map((value, key) => {
      return [key, value.state]
    }).object().value();

  return Bacon.combineTemplate(res)
    .map(state => {
      let canSubmit = _.all(_.map(state, field => field.canSubmit));
      state.canSubmit = canSubmit;
      return state;
    });
}

