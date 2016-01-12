import React, {Component} from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import FileInput from 'react-file-input';
import Remarkable from 'remarkable';
import Combobox from 'react-widgets/lib/Combobox';
import DropdownList from 'react-widgets/lib/DropdownList';
import Multiselect from 'react-widgets/lib/Multiselect';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import {colors} from '../forms/company';
import {Avatar, TextLabel} from './widgets';

export class BaseField extends Component{
  state = {field: undefined}

  componentWillUnmount(){
    this.props.field.state.offValue( this.subscribeFct );
  }

  componentWillMount(){
    this.subscribeFct =  v => this.setState({field: v});
    this.props.field.state.onValue( this.subscribeFct );
  }

  handleChange = (e) => {
    this.props.field.setValue( e.target.value );
  }

  message = () => {
    if(this.state.field && this.state.field.get('error')) return this.state.field.get('error');
    if(this.state.field && this.state.field.get('isLoading')) return 'Loading ...';
  }

  hasError = () => {
    return this.state.field && this.state.field.get('error');
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.field != nextState.field;
  }

  fieldsetClassNames = () => classNames( "form-group", { 'has-error': this.hasError() });
  inputClassNames = () => classNames( 'tm input form-control', { 'form-control-error': this.hasError() });
}


export class InputField extends BaseField {

  render(){
    if(!this.state.field)return false;
    const field = this.props.field;
    const labelUrl = this.props.isUrl ? <a href={this.state.field.get('value')}><i className="fa fa-external-link p-l-1"/></a> : "";

    return(
      <fieldset className={this.fieldsetClassNames()}>
        <label htmlFor={field.key}>
          {field.label}
          {labelUrl}
        </label>
        <input className={this.inputClassNames()} id={field.key} type={field.htmlType()} value={this.state.field.get('value')} placeholder={field.label} onChange={this.handleChange}/>
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
    if(!this.state.field)return false;

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

  shouldComponentUpdate(nextProps, nextState){
    return this.state.field != nextState.field ||
      this.state.mode != nextState.mode;
  }

  render(){
    if(!this.state.field)return false;
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
      const text = {__html: md.render(this.state.field.get('value'))};
      return <div style={{height: '100%'}} className="form-control" id={field.label} dangerouslySetInnerHTML={text}/>
    }

    const writer = () => {
      return <textarea 
        style={styles.textarea} 
        className={this.inputClassNames()} 
        id={field.key} 
        type={field.htmlType()} 
        value={this.state.field.get('value')} 
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
    if(!this.state.field)return false;

    let field = this.props.field;
    let labelUrl = this.props.isUrl ? <a href={this.state.field.get('value')}><i className="fa fa-external-link p-l-1"/></a> : "";

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
        <textarea style={styles.textarea} className={inputClassNames} id={field.key} type={field.htmlType()} value={this.state.field.get('value')} placeholder={field.label} onChange={this.handleChange}/>
        <small className="text-muted control-label">{this.message()}</small>
      </fieldset>
    )
  }
}

export class BaseSelectField extends BaseField{
  handleChange = (value) => {
    this.props.field.setValue( value );
  }

  shouldComponentUpdate(nextProps, nextState){
    //return this.state.field != nextState.field;
    return true;
  }

  componentWillMount(){
    this.subscribeFct =  v => {
      const state = {field: v};
      if(v.get('domainValue')){
        const domainValue = _.map(v.get('domainValue').toJS(), ({key, value}) => {return {label:value, value:key}} );
        state.domainValue = domainValue;
      }
      this.setState(state);
    };
    this.props.field.state.onValue( this.subscribeFct );
  }

  selectClassNames = () => classNames( 'tm select form-control', { 'form-control-error': this.hasError() });
}

export class DropdownField extends BaseSelectField{
  handleChange = (value) => {
    this.props.field.setValue( value.key );
  }

  componentWillMount(){
    this.subscribeFct =  v => {
      const state = {field: v};
      if(v.get('domainValue')) state.domainValue = v.get('domainValue').toJS();
      this.setState(state);
    };
    this.props.field.state.onValue( this.subscribeFct );
  }

  render(){
    if(!this.state.field) return false;
    let field = this.props.field;

    if(this.state.field.get('disabled')){
      const keyValue = _.find(this.state.domainValue, x => x.key === this.state.field.get("value"));
      return <TextLabel label={field.label} value={keyValue && keyValue.value}/>
    }else{
      return(
        <fieldset className={this.fieldsetClassNames()}>
          <label htmlFor={field.key}>{field.label}</label>
          <DropdownList 
            placeholder={field.label}
            valueField={'key'}
            textField={'value'}
            data={this.state.domainValue}  
            defaultValue={this.state.field.get('value')} 
            id={field.key} 
            caseSensitive={false}
            onChange={this.handleChange}/>
          <small className="text-muted control-label">{this.message()}</small>
        </fieldset>
      )
    }
  }
}

export class MultiSelectField2 extends BaseSelectField{
  handleChange = (values) => {
    this.props.field.setValue( _.map(values, v => v.key) );
  }

  componentWillMount(){
    this.subscribeFct =  v => {
      const state = {field: v};
      if(v.get('domainValue')) state.domainValue = v.get('domainValue').toJS();
      this.setState(state);
    };
    this.props.field.state.onValue( this.subscribeFct );
  }

  render(){
    if(!this.state.field) return false;
    let field = this.props.field;

    if(this.state.field.get('disabled')){
      const keyValue = _.find(this.state.domainValue, x => x.value === this.state.field.get("value"));
      return <TextLabel label={field.label} value={keyValue && keyValue.label}/>
    }else{
      const props = {
        placeholder: field.label,
        valueField: 'key',
        textField: 'value',
        data: this.state.domainValue,  
        value: this.state.field.get('value') && this.state.field.get('value').toJS() || [], 
        id: field.key, 
        caseSensitive: false,
        onChange: this.handleChange
      };

      const multiselect = React.createElement( Multiselect, props );
      return(
        <fieldset className={this.fieldsetClassNames()}>
          <label htmlFor={field.key}>{field.label}</label>
          {multiselect}
          <small className="text-muted control-label">{this.message()}</small>
        </fieldset>
      )
    }
  }
}

export class ComboboxField extends BaseSelectField{
  handleChange = (value) => {
    const data = _.isString(value) ? value : value.key;
    this.props.field.setValue( data );
  }

  componentWillMount(){
    this.subscribeFct =  v => {
      const state = {field: v};
      if(v.get('domainValue')) state.domainValue = v.get('domainValue').toJS();
      this.setState(state);
    };

    this.props.field.state.onValue( this.subscribeFct );
  }

  render(){
    if(!this.state.field) return false;
    let field = this.props.field;
    if(this.state.field.get('disabled')){
      const keyValue = _.find(this.state.domainValue, x => x.value === this.state.field.get("value"));
      return <TextLabel label={field.label} value={keyValue && keyValue.label}/>
    }else{
      return(
        <fieldset className={this.fieldsetClassNames()}>
          <label htmlFor={field.key}>{field.label}</label>
          <Combobox 
            placeholder={field.label}
            valueField={'key'}
            textField={'value'}
            suggest={true}
            data={this.state.domainValue}  
            defaultValue={this.state.field.get('value')} 
            id={field.key} 
            caseSensitive={false}
            onChange={this.handleChange}/>
          <small className="text-muted control-label">{this.message()}</small>
        </fieldset>
      )
    }
  }
}


export class SelectField extends BaseSelectField {
  render(){
    if(!this.state.field)return false;
    let field = this.props.field;

    if(this.state.field.get('disabled')){
      const keyValue = _.find(this.state.domainValue, x => x.value === this.state.field.get("value"));
      return <TextLabel label={field.label} value={keyValue && keyValue.label}/>
    }else{
      return(
        <fieldset className={this.fieldsetClassNames()}>
          <label htmlFor={field.key}>{field.label}</label>
          <Select 
            options={this.state.domainValue}  
            value={this.state.field.get('value')} 
            id={field.key} 
            clearable={false}
            onChange={this.handleChange}/>
          <small className="text-muted control-label">{this.message()}</small>
        </fieldset>
      )
    }
  }
}

const ColorItem = ({item}) => {
  const style = {
    backgroundColor: item.value,
    width: '100%',
    height: '2rem',
  }
  return <div style={style}/>;
}

export class SelectColorField extends BaseSelectField {

  handleChange = (value) => {
    this.props.field.setValue( value.key );
  }

  render(){
    if(!this.state.field)return false;
    let field = this.props.field;

    let options = _.map(this.props.options, color => {
      return { key: color, value: color};
    });

    return(
      <fieldset className={this.fieldsetClassNames()}>
        <label htmlFor={field.key}>{field.label}</label>
        <DropdownList 
          valueField='key'
          textField='value'
          data={options}  
          valueComponent={ColorItem}
          itemComponent={ColorItem}
          value={this.state.field.get('value')} 
          id={field.key} 
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
    if(!this.state.field) return false;
    let field = this.props.field;

    if(this.state.field.get('disabled')){
      const keyValue = _.find(this.state.domainValue, x => x.key === this.state.field.get('value'));
      return <TextLabel label={field.label} value={keyValue && keyValue.value}/>
    }else{
      const value = this.state.field.get('value');
      return(
        <fieldset className={this.fieldsetClassNames()}>
          <label htmlFor={field.key}>{field.label}</label>
          <Select 
            options={this.state.domainValue}  
            value={value && value.toJS()} 
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
    const defaultAvatar = <div className="m-r-1"><Avatar name={this.state.name} color={this.state.color}/></div>;
    switch(this.state.type){
      case 'url':
        return this.state.url ? <div className="m-r-1"> <Avatar src={this.state.url}/></div> : defaultAvatar;
      case 'src':
        return this.state.src ? <div className="m-r-1"><Avatar src={this.state.src}/></div> : defaultAvatar;
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
          <DropdownField field={this.props.field.field('type')}/>
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


export class DateField extends BaseField{
  handleChange = (date) => {
    this.props.field.setValue( date );
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.field != nextState.field 
      || this.props.maxDate != nextProps.maxDate
      || this.props.minDate != nextProps.minDate;
  }

  render(){
    if(!this.state.field)return false;
    const field = this.props.field;
    const labelUrl = this.props.isUrl ? <a href={this.state.field.get('value')}><i className="fa fa-external-link p-l-1"/></a> : "";
    const props = {
      value: this.state.field.get('value'),
      onChange: this.handleChange,
      time: false,
    };
    if(this.props.minDate) props.min = this.props.minDate;
    if(this.props.maxDate) props.max = this.props.maxDate;
    const Picker = React.createElement(DateTimePicker, props);

    return(
      <fieldset className={this.fieldsetClassNames()}>
        <label htmlFor={field.key}>
          {field.label}
          {labelUrl}
        </label>
        {Picker}
        <small className="text-muted control-label">{this.message()}</small>
      </fieldset>
    )
  }
}

export class PeriodField extends Component{
  state = {};

  componentWillUnmount(){
    this.unsubscribe1();
    this.unsubscribe2();
  }

  componentWillMount(){
    this.unsubscribe1 = this.props.startDate.onValue( state => {
      this.setState({startDate: state.value})
    });
    this.unsubscribe2 = this.props.endDate.onValue( state => {
      this.setState({endDate: state.value})
    });
  }

  render(){
    return (
      <div className="row">
        <div className="col-md-6">
          <DateField field={this.props.startDate} maxDate={this.state.endDate}/>
        </div>
        <div className="col-md-6">
          <DateField field={this.props.endDate} minDate={this.state.startDate}/>
        </div>
      </div>
    )
  }
}



export CountryField from './fields/countries';
export TagsField from './fields/tags';
export CityField from './fields/city';
