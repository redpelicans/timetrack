import React, {Component} from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import FileInput from 'react-file-input';
import Remarkable from 'remarkable';
import {avatarTypes, colors} from '../forms/company';


export class InputField extends Component {
  state = undefined;

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

  render(){
    // avoid to render without a state
    if(!this.state)return false;

    let field = this.props.field;
    let message = () => {
      if(this.state.error) return this.state.error;
      if(this.state.isLoading) return 'Loading ...';
    }
    let hasError = () => {
      return this.state.error || this.props.field.isRequired() && this.props.field.isNull(this.state.value);
    }

    let fieldsetClassNames = classNames( "form-group", { 'has-error': hasError() });
    let inputClassNames= classNames( 'tm input form-control', { 'form-control-error': hasError() });
    let labelUrl = this.props.isUrl ? <a href={this.state.value}><i className="fa fa-external-link p-l"/></a> : "";

    return(
      <fieldset className={fieldsetClassNames}>
        <label htmlFor={field.key}>
          {field.label}
          {labelUrl}
        </label>
        {/*<input className={inputClassNames} id={field.key} type={field.htmlType()} defaultValue={this.state.value} placeholder={field.label} onChange={this.handleChange}/>*/}
        <input className={inputClassNames} id={field.key} type={field.htmlType()} value={this.state.value} placeholder={field.label} onChange={this.handleChange}/>
        <small className="text-muted control-label">{message()}</small>
      </fieldset>
    )
  }
}

export class FileField extends Component {
  state = undefined;

  // constructor(props){
  //   super(props);
  //   console.log("FileField.constructor")
  // }

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentDidMount(){
    this.unsubscribe = this.props.field.onValue( v => {
      this.setState({value: v.value});
    });
  }

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

    let field = this.props.field;
    let message = () => {
      if(this.state.error) return this.state.error;
      if(this.state.isLoading) return 'Loading ...';
    }
    let hasError = () => {
      return this.state.error || this.props.field.isRequired() && this.props.field.isNull(this.state.value);
    }

    let fieldsetClassNames = classNames( "form-group", { 'has-error': hasError() });
    let inputClassNames= classNames( 'tm input form-control', { 'form-control-error': hasError() });
    let style={
      display: 'block',
      height: '36px',
    }

    return(
      <fieldset className={fieldsetClassNames}>
        <label htmlFor={field.key}>
          {field.label}
        </label>
        <FileInput 
          className={inputClassNames} 
          id={field.key} 
          placeholder={this.props.filename || field.label} 
          onChange={this.handleChange}/>
        <small className="text-muted control-label">{message()}</small>
      </fieldset>
    )
  }
}

export class MarkdownEditField extends Component {
  state = { mode: 'write' };

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentDidMount(){
    this.unsubscribe = this.props.field.onValue( v => {
      this.setState(v);
    });
  }

  handleClick = (mode, e) => {
    e.preventDefault();
    this.setState({mode: mode});
  }

  handleChange = (e) => {
    this.props.field.setValue( e.target.value );
  }

  render(){
    if(!this.state)return false;
    let field = this.props.field;

    let message = () => {
      if(this.state.error) return this.state.error;
      if(this.state.isLoading) return 'Loading ...';
    }

    let hasError = () => {
      return this.state.error || this.props.field.isRequired() && this.props.field.isNull(this.state.value);
    }

    let fieldsetClassNames = classNames( "form-group", { 'has-error': hasError() });
    let inputClassNames= classNames( 'tm input form-control', { 'form-control-error': hasError() });

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
        className={inputClassNames} 
        id={field.key} 
        type={field.htmlType()} 
        value={this.state.value} 
        placeholder={field.label} 
        onChange={this.handleChange}/>
    }

    let widget = this.state.mode === 'write' ? writer() : reader();

    return(
      <fieldset className={fieldsetClassNames}>
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
        <small className="text-muted control-label">{message()}</small>
      </fieldset>

    )
  }
}
export class TextAreaField extends Component {
  state = undefined;

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

  render(){
    // avoid to render without a state
    if(!this.state)return false;

    let field = this.props.field;
    let message = () => {
      if(this.state.error) return this.state.error;
      if(this.state.isLoading) return 'Loading ...';
    }
    let hasError = () => {
      return this.state.error || this.props.field.isRequired() && this.props.field.isNull(this.state.value);
    }

    let fieldsetClassNames = classNames( "form-group", { 'has-error': hasError() });
    let inputClassNames= classNames( 'tm input form-control', { 'form-control-error': hasError() });
    let labelUrl = this.props.isUrl ? <a href={this.state.value}><i className="fa fa-external-link p-l"/></a> : "";
    let styles = {
      textarea: {
        minHeight: '200px',
      }
    }

    return(
      <fieldset className={fieldsetClassNames}>
        <label htmlFor={field.key}>
          {field.label}
          {labelUrl}
        </label>
        <textarea style={styles.textarea} className={inputClassNames} id={field.key} type={field.htmlType()} value={this.state.value} placeholder={field.label} onChange={this.handleChange}/>
        <small className="text-muted control-label">{message()}</small>
      </fieldset>
    )
  }
}



export class SelectField extends Component {
  state = {}

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentDidMount(){
    this.unsubscribe = this.props.field.onValue( v => {
      this.setState(v);
    });
  }

  handleChange = (value) => {
    this.props.field.setValue( value );
  }

  render(){
    let field = this.props.field;
    let message = () => {
      if(this.state.error) return this.state.error;
      if(this.state.isLoading) return 'Loading ...';
    }
    let hasError = () => {
      return this.state.error || this.props.field.isRequired() && this.props.field.isNull(this.state.value);
    }

    let fieldsetClassNames = classNames( "form-group", { 'has-error': hasError() });
    let selectClassNames= classNames( 'tm select form-control', { 'form-control-error': hasError() });
    let options = _.map(field.domainValue, ({key, value}) => {return {label:value, value:key}} );

    return(
      <fieldset className={fieldsetClassNames}>
        <label htmlFor={field.key}>{field.label}</label>
        <Select 
          options={options}  
          value={this.state.value} 
          id={field.key} 
          clearable={false}
          onChange={this.handleChange}/>
        <small className="text-muted control-label">{message()}</small>
      </fieldset>
    )
  }
}

export class SelectColorField extends Component {
  state = {}

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentDidMount(){
    this.unsubscribe = this.props.field.onValue( v => {
      this.setState(v);
    });
  }

  handleChange = (value) => {
    this.props.field.setValue( value );
  }

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

    let message = () => {
      if(this.state.error) return this.state.error;
      if(this.state.isLoading) return 'Loading ...';
    }
    let hasError = () => {
      return this.state.error || this.props.field.isRequired() && this.props.field.isNull(this.state.value);
    }

    let fieldsetClassNames = classNames( "form-group", { 'has-error': hasError() });
    let selectClassNames= classNames( 'tm select form-control', { 'form-control-error': hasError() });

    let options = _.map(this.props.options, color => {
      return { key: color, value: color};
    });

    return(
      <fieldset className={fieldsetClassNames}>
        <label htmlFor={field.key}>{field.label}</label>
        <Select 
          options={options}  
          optionRenderer={this.renderOption}
          valueRenderer={this.renderOption}
          value={this.state.value} 
          id={field.key} 
          clearable={false}
          onChange={this.handleChange}/>
        <small className="text-muted control-label">{message()}</small>
      </fieldset>
    )
  }
}

export const AvatarView = ({obj, name = obj.name}) => {
  if(!obj || !obj.avatar) return <Avatar name={"?"}/>;

  const defaultAvatar = <Avatar name={name} color={obj.avatar.color}/>;

  switch(obj.avatar.type){
    case 'url':
      return obj.avatar.url ? <Avatar src={obj.avatar.url}/> : defaultAvatar;
    case 'src':
      return obj.avatar.src ? <Avatar src={obj.avatar.src}/> : defaultAvatar;
    default:
      return defaultAvatar;
  }
}

export class Avatar extends Component {
  rndColor() {
    let colors = ['#d73d32', '#7e3794', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080'];
    let index = Math.floor(Math.random()*colors.length);
    return colors[ index ];
  }

  getInitials(name=''){
    let parts = name.split(' ').slice(0, 3);
    return _.map(parts, part => part.substr(0,1).toUpperCase()).join('');
  }

  render(){
    let imageStyle =  {
      width: this.props.size || '36px',
      height: this.props.size || '36px',
      borderRadius: '50%'
    };

    let initialsStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: this.props.color || this.rndColor(),
      width: this.props.size || '36px',
      height: this.props.size || '36px',
      color: '#FFF',
      textTransform: 'uppercase',
      borderRadius: '50%',
      fontSize: '1rem',
    }

    if(this.props.src){
      return (
        <div>
          <img src={this.props.src} style={imageStyle}/>
        </div>
      )
    }else{
      return <div style={initialsStyle}>{this.getInitials(this.props.name)}</div>
    }
  }

}

export const TextLabel = ({label, value, isUrl}) => {
  const labelUrl = isUrl ? <a href={value}><i className="fa fa-external-link p-l"/></a> : "";
  return(
    <fieldset className="form-group">
      <label htmlFor={label}> 
        {label} 
        {labelUrl}
      </label>
      <span className="form-control" id={label}>{value}</span>
    </fieldset>
  )
}

export const MarkdownText = ({label, value}) => {
  const md = new Remarkable();
  const text = {__html: md.render(value)};
  return(
    <fieldset className="form-group">
      <label htmlFor={label}> 
        {label} 
      </label>
      <div style={{height: '100%'}}className="form-control" id={label} dangerouslySetInnerHTML={text}/>
    </fieldset>
  )
}

