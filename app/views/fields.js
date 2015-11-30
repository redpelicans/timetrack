import React, {Component} from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import FileInput from 'react-file-input';
import Remarkable from 'remarkable';
import {colors} from '../forms/company';
import {Avatar} from './widgets';


class BaseField extends Component{
  state = {}

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentDidMount(){
    this.unsubscribe = this.props.field.onValue( v => {
      this.setState(v);
    });
  }

  handleChange = (e) => {
    this.props.field.setValue( e.target.value );
  }

  message = () => {
    if(this.state.error) return this.state.error;
    if(this.state.isLoading) return 'Loading ...';
  }

  hasError = () => {
    return this.state.error || this.props.field.isRequired() && this.props.field.isNull(this.state.value);
  }

  fieldsetClassNames = () => classNames( "form-group", { 'has-error': this.hasError() });
  inputClassNames = () => classNames( 'tm input form-control', { 'form-control-error': this.hasError() });
}


export class InputField extends BaseField {

  render(){
    if(!this.state)return false;
    const field = this.props.field;
    const labelUrl = this.props.isUrl ? <a href={this.state.value}><i className="fa fa-external-link p-l"/></a> : "";

    return(
      <fieldset className={this.fieldsetClassNames()}>
        <label htmlFor={field.key}>
          {field.label}
          {labelUrl}
        </label>
        <input className={this.inputClassNames()} id={field.key} type={field.htmlType()} value={this.state.value} placeholder={field.label} onChange={this.handleChange}/>
        <small className="text-muted control-label">{this.message()}</small>
      </fieldset>
    )
  }
}

export class FileField extends BaseField {

  handleChange = (e) => {
    this.props.onFilenameChange(e.target.value);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      this.props.field.setValue( reader.result );
    }
    reader.readAsDataURL(file);
  }

  render(){
    if(!this.state)return false;

    const field = this.props.field;

    const style={
      display: 'block',
      height: '36px',
    }

    return(
      <fieldset className={this.fieldsetClassNames()}>
        <label htmlFor={field.key}>
          {field.label}
        </label>
        <FileInput 
          className={this.inputClassNames()} 
          id={field.key} 
          placeholder={this.props.filename || field.label} 
          onChange={this.handleChange}/>
        <small className="text-muted control-label">{this.message()}</small>
      </fieldset>
    )
  }
}

export class MarkdownEditField extends BaseField {
  state = { mode: 'write' };

  handleClick = (mode, e) => {
    e.preventDefault();
    this.setState({mode: mode});
  }

  render(){
    if(!this.state)return false;
    let field = this.props.field;

    let styles = {
      textarea: {
        minHeight: '200px',
      },
      radio:{
        float: 'right',
      },
      button:{
        fontSize: '.7rem',
        lineHeight: '.5rem',
      }
    }

    const reader = () => { 
      const md = new Remarkable();
      const text = {__html: md.render(this.state.value)};
      return <div style={{height: '100%'}} className="form-control" id={field.label} dangerouslySetInnerHTML={text}/>
    }

    const writer = () => {
      return <textarea 
        style={styles.textarea} 
        className={this.inputClassNames()} 
        id={field.key} 
        type={field.htmlType()} 
        value={this.state.value} 
        placeholder={field.label} 
        onChange={this.handleChange}/>
    }

    let widget = this.state.mode === 'write' ? writer() : reader();

    return(
      <fieldset className={this.fieldsetClassNames()}>
        <label htmlFor={field.key}>
          {field.label}
        </label>
        <div style={styles.radio} className="btn-group" data-toggle="buttons">
          <label style={styles.button} className="btn btn-secondary active" onClick={this.handleClick.bind(null, 'write')}>
            <input type="radio" name="options" id="option1" autoComplete="off"/> Edit
          </label>
          <label style={styles.button} className="btn btn-secondary" onClick={this.handleClick.bind(null, 'read')}>
            <input type="radio" name="options" id="option2" autoComplete="off"/> View
          </label>
        </div>
        {widget}
        <small className="text-muted control-label">{this.message()}</small>
      </fieldset>
    )
  }
}

export class TextAreaField extends BaseField {


  render(){
    // avoid to render without a state
    if(!this.state)return false;

    let field = this.props.field;
    let labelUrl = this.props.isUrl ? <a href={this.state.value}><i className="fa fa-external-link p-l"/></a> : "";

    let styles = {
      textarea: {
        minHeight: '200px',
      }
    }

    return(
      <fieldset className={this.fieldsetClassNames()}>
        <label htmlFor={field.key}>
          {field.label}
          {labelUrl}
        </label>
        <textarea style={styles.textarea} className={inputClassNames} id={field.key} type={field.htmlType()} value={this.state.value} placeholder={field.label} onChange={this.handleChange}/>
        <small className="text-muted control-label">{this.message()}</small>
      </fieldset>
    )
  }
}

class BaseSelectField extends BaseField{
  handleChange = (value) => {
    this.props.field.setValue( value );
  }

  selectClassNames = () => classNames( 'tm select form-control', { 'form-control-error': this.hasError() });
  options = () => _.map(this.props.field.domainValue, ({key, value}) => {return {label:value, value:key}} );
}

export class SelectField extends BaseSelectField {
  render(){
    console.log("render " + this.props.field.label)
    let field = this.props.field;

    if(this.state.disabled){
      const keyValue = _.find(field.domainValue, x => x.key === this.state.value);
      return <TextLabel label={field.label} value={keyValue && keyValue.value}/>
    }else{
      return(
        <fieldset className={this.fieldsetClassNames()}>
          <label htmlFor={field.key}>{field.label}</label>
          <Select 
            options={this.options()}  
            value={this.state.value} 
            id={field.key} 
            clearable={false}
            onChange={this.handleChange}/>
          <small className="text-muted control-label">{this.message()}</small>
        </fieldset>
      )
    }
  }
}

export class SelectColorField extends BaseSelectField {

  renderOption(option){
    let style = {
      backgroundColor: option.value,
      width: '100%',
      height: '1.1rem',
    }
    return <div style={style}/>;
  }

  render(){
    let field = this.props.field;

    let options = _.map(this.props.options, color => {
      return { key: color, value: color};
    });

    return(
      <fieldset className={this.fieldsetClassNames()}>
        <label htmlFor={field.key}>{field.label}</label>
        <Select 
          options={options}  
          optionRenderer={this.renderOption}
          valueRenderer={this.renderOption}
          value={this.state.value} 
          id={field.key} 
          clearable={false}
          onChange={this.handleChange}/>
        <small className="text-muted control-label">{this.message()}</small>
      </fieldset>
    )
  }
}

export class MultiSelectField extends BaseSelectField{

  handleChange = (value) => {
    this.props.field.setValue( value && value.split(',') || [] );
  }

  render(){
    console.log("render " + this.props.field.label)
    let field = this.props.field;

    if(this.state.disabled){
      const keyValue = _.find(field.domainValue, x => x.key === this.state.value);
      return <TextLabel label={field.label} value={keyValue && keyValue.value}/>
    }else{
      return(
        <fieldset className={this.fieldsetClassNames()}>
          <label htmlFor={field.key}>{field.label}</label>
          <Select 
            options={this.options()}  
            value={this.state.value} 
            id={field.key} 
            clearable={false}
            allowCreate={this.props.allowCreate}
            multi={true}
            onChange={this.handleChange}/>
          <small className="text-muted control-label">{this.message()}</small>
        </fieldset>
      )
    }
  }

}


export class AvatarViewField extends Component{
  state = {name: 'Red Pelicans'}

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentWillMount(){
    this.unsubscribe = this.props.obj.onValue( state => {
      let name;
      if(this.props.type === 'company')
        name = state.name.value;
      else
        name = [state.firstName.value, state.lastName.value].join(' ');
      this.setState({
        type: state.avatar.type.value,
        name: name,
        color: state.avatar.color.value,
        url: state.avatar.url.error ? undefined :  state.avatar.url.value,
        src: state.avatar.src.value,
      })
    });
  }

  getAvatarType(){
    const defaultAvatar = <div className="m-r"><Avatar name={this.state.name} color={this.state.color}/></div>;
    switch(this.state.type){
      case 'url':
        return this.state.url ? <div className="m-r"> <Avatar src={this.state.url}/></div> : defaultAvatar;
      case 'src':
        return this.state.src ? <div className="m-r"><Avatar src={this.state.src}/></div> : defaultAvatar;
      default:
        return defaultAvatar;
    }
  }

  render(){
    return this.getAvatarType();
  }
}

export class AvatarChooserField extends Component{
  state = {type: this.props.field.defaultValue};

  handleFilenameChange = (filename) => {
    this.setState({filename: filename});
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentDidMount(){
    this.colorField = <SelectColorField options={colors} field={this.props.field.field('color')}/>;
    this.logoUrlField = <InputField field={this.props.field.field('url')} isUrl={true}/>;
    this.logoFileField = <FileField filename={this.state.filename} onFilenameChange={this.handleFilenameChange} field={this.props.field.field('src')}/>;

    this.unsubscribe = this.props.field.onValue( v => {
      this.setState({
        type: v.type.value,
      });
    });
  }

  getField(){
    switch(this.state.type){
      case 'url':
        return this.logoUrlField;
      case 'src':
        return this.logoFileField;
      default:
        return this.colorField;
    }
  }

  render(){
    return (
      <div className="row">
        <div className="col-md-3">
          <SelectField field={this.props.field.field('type')}/>
        </div>
        <div className="col-md-9">
          {this.getField()}
        </div>
      </div>
    )
  }
}


export class StarField extends Component{
  state = undefined;

  componentWillUnmount(){
    if(this.unsubscribe) this.unsubscribe();
  }

  componentDidMount(){
    this.unsubscribe = this.props.field.onValue( v => {
      this.setState({preferred: v.value});
    });
  }

  handleChange = (e) => {
    this.props.field.setValue( !this.state.preferred );
    e.preventDefault();
  }

  render(){
    if(!this.state) return false;
    let field = this.props.field;
    let preferred = this.state.preferred;

    let style={
      display: 'block',
      color: preferred ? '#00BCD4' : 'grey',
      fontSize: '1.5rem',
    };

    return (
      <fieldset className="form-group">
        <label htmlFor={field.key}>{field.label}</label>
        <a id={field.key} href="#" onClick={this.handleChange}>
          <i style={style} className="iconButton fa fa-star-o"/>
        </a>
      </fieldset>
    )
  }
}



