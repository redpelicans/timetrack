import _ from 'lodash';
import Bacon from 'baconjs';
import companies from '../models/companies';

class AbstractMultiField{
  constructor(fields, name){
    this.key = name;
    this.fields = {};
    this.initFields(fields);
  }

  reset(){
    _.each(this.fields, field => field.reset());
  }

  hasBeenModified(state){
    return _.any(state, (subState, name) => {
      let field = this.field(name);
      if(field && field.hasBeenModified) return field.hasBeenModified(subState);
      else return false;
    });
  }

  field(path){
    return _.inject(path.split('.'), function(o, p){return o && o.fields[p]}, this);
  }

  get path(){
    if(!this.parent) return '';
    return `${this.parent.path}.${this.key}`;
  }

  get root(){
    if(!this.parent)return this;
    return this.parent.root;
  }

  initFields(fields){
    for(let field of fields){
      this.fields[field.key] = field;
    }
  }

  combineStates(){
    let fields = this.fields;
    let field = this;
    let res = _.chain(fields).map((value, key) => {
        return [key, value.state]
      }).object().value();

    return Bacon.combineTemplate(res)
      .map(state => {
        let canSubmit = _.all(_.map(state, subState => subState.canSubmit));
        state.canSubmit = canSubmit;
        state.hasBeenModified = field.hasBeenModified(state);
        return state;
      });
  }

  initState(){
    _.each(this.fields, field =>{
      field.initState();
    })
    this.state = this.combineStates();
  }
}

export class Formo extends AbstractMultiField{
  constructor(fields, document){
    super(fields);
    this.propagateParent();
    this.document = document;
    this.submitBus = new Bacon.Bus();
    this.cancelBus = new Bacon.Bus();
    this.initState();
    this.state.log();
    this.submitted = this.state.sampledBy(this.submitBus);
    this.cancelled = this.state.sampledBy(this.cancelBus, (state, cancelOptions) => {
        state.cancelOptions = cancelOptions;
        return state;
      }
    );
  }

  propagateParent(){
    function propagate(parent){
      if(!parent.fields)return;
      _.each(parent.fields, field =>{
        field.parent = parent;
        propagate(field);
      })
    }
    propagate(this);
  }

  submit(){
    this.submitBus.push(true);
  }

  getDocumentValue(path){
    if(!this.document) return;
    return _.inject(path.split('.').filter(x => x !== ''), function(d, p){return d && d[p]}, this.document);
  }

  cancel(options){
    this.cancelBus.push(options);
  }


  toJS(state){
    let res = {};
    _.each(state, (subState, name) => {
      if(_.isObject(subState)){
        if('value' in subState) res[name] = subState.field.castedValue(subState.value);
        else res[name] = this.toJS(subState);
      }
    }); 
   return res;
  }
}

export class MultiField extends AbstractMultiField{
  constructor(name, fields){
    super(fields, name);
  }
}

export class FieldGroup extends AbstractMultiField{
  constructor(name, fields){
    super(fields, name);
  }
}

export class Field{
  constructor(name, schema){
    this.schema = schema;
    this.key = name;
  }

  initState(){
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
        value: this.defaultValue,
        field: this,
        domainValues: this.schema.domainValues,
        error: this.checkError(this.defaultValue),
        canSubmit: !this.checkError(this.defaultValue),
        isLoading: false,
      },
      this.doReset, (state, x) => {
        return {
          value: this.defaultValue,
          field: this,
          domainValues: this.schema.domainValues,
          error: this.checkError(this.defaultValue),
          canSubmit: !this.checkError(this.defaultValue),
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

  castedValue(value){
    switch(this.type){
      case 'number':
      case 'integer':
        return Number(value);
      case 'boolean':
        return Boolean(value);
      default: 
        if(value === '')return;
        return value;
    }
  }

  hasBeenModified(state){
    return this.castedValue(state.value) !== this.defaultValue;
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
    return this.root && this.root.getDocumentValue(this.path) || this.schema.defaultValue;
  }

  get label(){
    return this.schema.label;
  }

  get type(){
    return this.schema.type;
  }

  get path(){
    return `${this.parent.path}.${this.key}`;
  }

  get root(){
    return this.parent && this.parent.root;
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
      case 'boolean':
        return "Input is not an boolean!";
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
}

// function initFields(fields, parent){
//   let data = {};
//   for(let field of fields){
//     field.parent = parent;
//     data[field.key] = field;
//     field._init();
//   }
//   return data;
// }


// function combineFields(parent, fields){
//   let res = _.chain(fields).map((value, key) => {
//       return [key, value.state]
//     }).object().value();
//
//   return Bacon.combineTemplate(res)
//     .map(state => {
//       let canSubmit = _.all(_.map(state, subState => subState.canSubmit));
//       state.canSubmit = canSubmit;
//       state.hasBeenModified = parent.hasBeenModified(state);
//       return state;
//     });
// }


