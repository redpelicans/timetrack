
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
            number: /^[0-9]*(\.[0-9]+)?$/
          , integer: /^[0-9]+$/ 
        }[this.attrDef.type];
      }

      isNull(value){
        return _.isUndefined(value) || value === "";
      }

      get value(){
        let {error, value} = this.state;
        if(error)throw new Error(this.errorMessage(value));
        if(this.isNull(value) && this.isRequired()){
          let error = this.errorMessage(value);
          this.setState({error: error});
          throw new Error(error);
        }
        return this.getTypedValue(value);
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


