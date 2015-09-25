
export class Schema{
  constructor(id, jsonSchema){
    this.id = id;
    this.jsonSchema = jsonSchema || {};
    this._registered= {};
  }

  field(name){
    return new Field(name, this.get(name) || {label: `${name}-Unknown`, type: 'string'}, this);
  }

  get(path){ 
    return _.inject(path.split('.'), function(o, p){return o && o[p]}, this.jsonSchema);
  }

  set(object, path, value){
    if(_.isUndefined(value))return;
    let current = object;
    let levels = path.split('.');
    let [lastAttr, firstLevels] = [levels[levels.length-1], levels.slice(0, -1)];
    for(let level of firstLevels){
      if(!current[level])current[level] = {};
      current = current[level];
    }
    current[lastAttr] = value;
  }

  register(field){
    this._registered[field.key] = field;
  }
  
  registeredFields(){
    return _.values(this._registered);
  }

  getData(){
    let data = {};
    let errors = [];
    for(let field of this.registeredFields()){
      try{
        this.set(data, field.key, field.value); 
      }catch(e){
        errors.push(e);
      }
    }
    if(errors.length)throw new Error(errors);
    return data;
  }
}

class Field{
  constructor(name, schema, formo){
    this.key = name;
    this.schema = schema;
    this.formo = formo;
  }

  bind(component){
    this.component = component;
    this.formo.register(this); 
  }

  get type(){
    return this.schema.type;
  }

  get pattern(){
    return this.schema.pattern || {
        number: /^[0-9]*(\.[0-9]+)?$/
      , integer: /^[0-9]+$/ 
    }[this.schema.type];
  }

  isNull(value){
    return _.isUndefined(value) || value === "";
  }

  get defaultValue(){
    return this.schema.defaultValue;
  }

  get values(){
    return this.schema.values;
  }

  get value(){
    return this.getTypedValue(this.component.fieldValue());
  }

  checkValue(value){
    if(this.isNull(value) && this.isRequired())return this.errorMessage(value);
    else if(!this.checkPattern(value)) return this.errorMessage(value);
  }

  checkPattern(value){
    return value.match(this.pattern);
  }

  getTypedValue(value){
    switch(this.type){
      case 'number':
      case 'integer':
        return Number(value);
      default: return value;
    }
  }

  errorMessage(value){
    if(this.isNull(value) && this.isRequired())return "Input required";
    if(this.pattern)return "Input doesn't match pattern!"
    switch(this.type){
      case 'number':
        return "Input is not a number!";
      case 'integer':
        return "Input is not an integer!";
    }
    return "Wrong input!";
  }

  get label(){
    return this.schema.label;
  }

  isRequired(){
    return this.schema.required;
  }


}



