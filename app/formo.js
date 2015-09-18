
import {validate} from 'jsonschema';

export class Schema{
  constructor(id, jsonSchema){
    this.id = id;
    this.jsonSchema = jsonSchema || {};
    this._registered= {};
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

  register(formEntity){
    this._registered[formEntity.attrKey] = formEntity;
  }
  
  renderedEntries(){
    return _.values(this._registered);
  }

  isRequired(path){
    //return _.contains(this.jsonSchema.required || [], path);
    return this.attrDef.required;
  }

  getData(){
    let data = {};
    let errors = [];
    for(let entry of this.renderedEntries()){
      try{
        this.set(data, entry.attrKey, entry.value); 
      }catch(e){
        errors.push(e);
      }
    }
    if(errors.length)throw new Error(errors);
    return data;
  }
}

export function input(formoSchema){
  return function(constructor){
    return class extends constructor{
      handleChange = () => {
        this.setState({value: this.refs[this.attrKey].getDOMNode().value});
      }

      constructor(props){
        super(props);
        this.formoSchema = formoSchema || this.props.schema;
        this.state = {error: false, value: this.attrDef && this.attrDef.defaultValue || ""};
      }

      get localSchema(){
        let schema = {
          id: `${this.formoSchema.id}/${this.attrKey}`,
          type: "object",
        };
        schema.properties = { [this.attrKey]: this.attrDef };
        if(this.isRequired())schema.required = [this.attrKey];
        return schema;
      }

      get inputMessage(){
        if(this.pattern)return "Input doesn't match pattern!"
        switch(this.type){
          case 'number':
            return "Input is not a number!";
          case 'integer':
            return "Input is not an integer!";
        }
        return "Wrong input!";
      }

      get attrDef(){
        return this.formoSchema.get(this.attrKey) || {label: `${this.attrKey}-Unknown`, type: 'string'};
      }

      get attrKey(){
        return this.props && this.props.attr;
      }

      get type(){
        return this.attrDef.type;
      }

      get pattern(){
        return this.attrDef.pattern || {
          number: "-?[0-9]*(\.[0-9]+)?" 
          , integer: "^[0-9]+$" 
        }[this.attrDef.type];
      }

      hasNoValue(){
        let data =  this.state.value;
        return _.isUndefined(data) || data === "";
      }

      get value(){
        let data =  this.state.value;
        let value = undefined;
        if(!this.hasNoValue()) value = (this.attrDef.type === 'number' || this.attrDef.type === 'integer' ? Number(data) : data);
        try{
          this.validate({[this.attrKey]: value});
        }catch(e){
          this.setState({error: true});
          throw e;
        }
        this.setState({error: false});
        return value;
      }

      validate(value){
        let validation = validate(value, this.localSchema);
        if(validation.errors.length)throw new Error(validation.errors[0]);
      }

      get label(){
        return this.attrDef.label;
      }

      isRequired(){
        return this.attrDef.required;
      }

      render(){
        this.formoSchema.register(this); 
        return super.render();
      }

    }

  }
}


