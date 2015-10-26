import _ from 'lodash';
import Bacon from 'baconjs';

export class Formo{
  constructor(fields){
    this.fields = {};
    initFields.bind(this.fields)(fields);
    this.state = Bacon.combineTemplate(combineFieldsTemplate.bind(this)());
  }

  field(path){
    return _.inject(path.split('.'), function(o, p){return o && o[p]}, this.fields);
  }
}

export class Field{
  constructor(name, schema){
    _.extend(this, schema);
    this.key = name;
    this.stream = new Bacon.Bus();
    this.state = Bacon.update(
      {
        value: schema.defaultValue,
        error: this.getError(schema.defaultValue) 
      },
      [this.stream], (previous, data) => {
        if(this.checkValue(data.value)){
          return {value: data.value, error: undefined};
        }else{
          let error = this.getError(data.value) 
          return {value: data.value, error: error};
        }

      }
    );
  }

  checkValue(value){
    if(this.isNull(value) && this.isRequired() || !this.checkPattern(value)) return false
    return true;
  }

  checkPattern(value){
    if(this.type && this.type === 'text') return true;
    return value.match(this.getPattern());
  }

  getError(value){
    if(!this.type || this.type === 'text') return;
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
        return 'number';
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
    this.stream.push({value: value});
  }


  isRequired(){
    return this.required;
  }
}


export class MultiField{
  constructor(name, fields){
    this.key = name;
    this.fields = {};
    initFields.bind(this)(fields);
    this.state = Bacon.combineTemplate(combineFieldsTemplate.bind(this)());
  }
}

export class FieldGroup{
  constructor(name, fields){
    this.key = name;
    this.fields = {};
    initFields.bind(this)(fields);
    this.state = Bacon.combineTemplate(combineFieldsTemplate.bind(this)());
  }
}

function initFields(fields){
    for(let field of fields){
      this[field.key] = field;
    }
}

function combineFieldsTemplate(){
  return _.chain(this.fields).map((value, key) => {
    return [key, value.state]
  }).object().value();
}
