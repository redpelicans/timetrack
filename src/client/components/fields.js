import React, {Component, PropTypes} from 'react'
import resizeImage from 'resize-image'
import classNames from 'classnames'
import Select from 'react-select'
import FileInput from 'react-file-input'
import Remarkable from 'remarkable'
import Combobox from 'react-widgets/lib/Combobox'
import DropdownList from 'react-widgets/lib/DropdownList'
import Multiselect from 'react-widgets/lib/Multiselect'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import colors from '../utils/colors';
import {Avatar, TextLabel} from './widgets'

export class BaseField extends Component{
  state = {field: undefined}

  componentWillUnmount(){
    this.props.field.state.offValue( this.subscribeFct )
  }

  componentWillMount(){
    this.subscribeFct =  v => this.setState({field: v})
    this.props.field.state.onValue( this.subscribeFct )
  }

  handleChange = (e) => {
    this.props.field.setValue( e.target.value )
  }

  message = () => {
    if(this.state.field && this.state.field.get('error')) return this.state.field.get('error')
    if(this.state.field && this.state.field.get('isLoading')) return 'Loading ...'
  }

  hasError = () => {
    return this.state.field && this.state.field.get('error')
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.field != nextState.field
  }

  fieldsetClassNames = () => classNames( "form-group", { 'has-error': this.hasError() })
  inputClassNames = () => classNames( 'tm input form-control', { 'form-control-error': this.hasError() })
}

BaseField.propTypes = {
  field: PropTypes.object.isRequired
}

export class InputField extends BaseField {

  render(){
    if(!this.state.field) return false
    const field = this.props.field
    const labelUrl = this.props.isUrl ? <a href={this.state.field.get('value')}><i className="fa fa-external-link p-l-1"/></a> : ""

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

InputField.propTypes = {
  field: PropTypes.object.isRequired,
  isUrl: PropTypes.bool
}

export class FileField extends BaseField {

  handleChange = (e) => {
    this.props.onFilenameChange(e.target.value)
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.onload = () => {
          const ratio = Math.min(32 / img.width, 32 / img.width)
          const data = resizeImage.resize(img, img.width * ratio, img.height * ratio, resizeImage.PNG);
          this.props.field.setValue(data)
      }
      img.src = reader.result
      this.props.field.setValue( reader.result )
    }
    reader.readAsDataURL(file)
  }

  render(){
    if(!this.state.field)return false

    const field = this.props.field

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

FileField.propTypes = {
  field:            PropTypes.object.isRequired,
  onFilenameChange: PropTypes.func.isRequired,
  filename:         PropTypes.string
}

export class MarkdownEditField extends BaseField {
  state = { mode: 'write' }

  handleClick = (mode, e) => {
    e.preventDefault()
    this.setState({mode: mode})
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.field != nextState.field ||
      this.state.mode != nextState.mode
  }

  render(){
    if(!this.state.field)return false
    let field = this.props.field

    let styles = {
      reader:{
        height: '100%',
        minHeight: '150px',
      },
      writer: {
        height: '100%',
        minHeight: '150px',
      },
      radio:{
        paddingTop: '5px',
        float: 'right',
      },
      button:{
        fontSize: '.7rem',
        lineHeight: '.5rem',
      }
    }

    const reader = () => {
      const classes = classNames( ' form-control', {
        'form-control-focus': this.props.focused,
      })
      const md = new Remarkable()
      const text = {__html: md.render(this.state.field.get('value'))}

      return <div style={styles.reader} className={classes} id={field.label} dangerouslySetInnerHTML={text}/>
    }


    const writer = () => {
      const classes = classNames( 'tm input form-control', {
        'form-control-error': this.hasError(),
        'form-control-focus': this.props.focused,
      })

      return <textarea
        style={styles.writer}
        className={classes}
        id={field.key}
        type={field.htmlType()}
        value={this.state.field.get('value')}
        placeholder={field.label}
        onChange={this.handleChange}/>
    }

    let widget = this.state.mode === 'write' ? writer() : reader()

    return(
      <fieldset className={this.fieldsetClassNames()}>
        <label htmlFor={field.key}>
          {field.label}
        </label>
        {widget}
        <div style={styles.radio} className="btn-group" data-toggle="buttons">
          <label style={styles.button} className="btn btn-secondary active" onClick={this.handleClick.bind(null, 'write')}>
            <input type="radio" name="options" id="option1" autoComplete="off"/> Edit
          </label>
          <label style={styles.button} className="btn btn-secondary" onClick={this.handleClick.bind(null, 'read')}>
            <input type="radio" name="options" id="option2" autoComplete="off"/> View
          </label>
        </div>
        <small className="text-muted control-label">{this.message()}</small>
      </fieldset>
    )
  }
}

MarkdownEditField.propTypes = {
  field:    PropTypes.object.isRequired,
  focused:  PropTypes.bool
}

export class TextAreaField extends BaseField {
  render(){
    // avoid to render without a state
    if(!this.state.field)return false

    let field = this.props.field
    let labelUrl = this.props.isUrl ? <a href={this.state.field.get('value')}><i className="fa fa-external-link p-l-1"/></a> : ""

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

TextAreaField.propTypes = {
  field: PropTypes.object.isRequired,
  isUrl: PropTypes.bool
}

export class BaseSelectField extends BaseField{
  handleChange = (value) => {
    this.props.field.setValue( value )
  }

  shouldComponentUpdate(nextProps, nextState){
    //return this.state.field != nextState.field
    return true
  }

  componentWillMount(){
    this.subscribeFct =  v => {
      const state = {field: v}
      if(v.get('domainValue')){
        const domainValue = _.map(v.get('domainValue').toJS(), ({key, value}) => {return {label:value, value:key}} )
        state.domainValue = domainValue
      }
      this.setState(state)
    }
    this.props.field.state.onValue( this.subscribeFct )
  }

  selectClassNames = () => classNames( 'tm select form-control', { 'form-control-error': this.hasError() })
}

BaseSelectField.propTypes = {
  field: PropTypes.object.isRequired
}

export class DropdownField extends BaseSelectField{
  handleChange = (value) => {
    this.props.field.setValue( value.key )
  }

  componentWillMount(){
    this.subscribeFct =  v => {
      const state = {field: v}
      if(v.get('domainValue')) state.domainValue = v.get('domainValue').toJS()
      this.setState(state)
    }
    this.props.field.state.onValue( this.subscribeFct )
  }

  render(){
    if(!this.state.field) return false
    let field = this.props.field

    if(this.state.field.get('disabled')){
      const keyValue = _.find(this.state.domainValue, x => x.key === this.state.field.get("value"))
      return <TextLabel label={this.state.field.get('label')} value={keyValue && keyValue.value}/>
    }else{
      return(
        <fieldset className={this.fieldsetClassNames()}>
          <label htmlFor={field.key}>{this.state.field.get('label')}</label>
          <DropdownList
            placeholder={field.label}
            valueField={'key'}
            textField={'value'}
            data={this.state.domainValue}
            //defaultValue={this.state.field.get('value')}
            value={this.state.field.get('value')}
            id={field.key}
            caseSensitive={false}
            onChange={this.handleChange}/>
          <small className="text-muted control-label">{this.message()}</small>
        </fieldset>
      )
    }
  }
}

DropdownField.propTypes = {
  field: PropTypes.object.isRequired
}

export class MultiSelectField2 extends BaseSelectField{
  handleChange = (values) => {
    this.props.field.setValue( _.map(values, v => v.key) )
  }

  componentWillMount(){
    this.subscribeFct =  v => {
      const state = {field: v}
      if(v.get('domainValue')) state.domainValue = v.get('domainValue').toJS()
      this.setState(state)
    }
    this.props.field.state.onValue( this.subscribeFct )
  }

  render(){
    if(!this.state.field) return false
    let field = this.props.field

    if(this.state.field.get('disabled')){
      const keyValue = _.find(this.state.domainValue, x => x.value === this.state.field.get("value"))
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
      }

      const multiselect = React.createElement( Multiselect, props )
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

MultiSelectField2.propTypes = {
  field: PropTypes.object.isRequired
}

export class ComboboxField extends BaseSelectField{
  handleChange = (value) => {
    const data = _.isString(value) ? value : value.key
    this.props.field.setValue( data )
  }

  componentWillMount(){
    this.subscribeFct =  v => {
      const state = {field: v}
      if(v.get('domainValue')) state.domainValue = v.get('domainValue').toJS()
      this.setState(state)
    }

    this.props.field.state.onValue( this.subscribeFct )
  }

  render(){
    if(!this.state.field) return false
    let field = this.props.field
    if(this.state.field.get('disabled')){
      const keyValue = _.find(this.state.domainValue, x => x.value === this.state.field.get("value"))
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

ComboboxField.propTypes = {
  field: PropTypes.object.isRequired
}

export class SelectField extends BaseSelectField {
  render(){
    if(!this.state.field)return false
    let field = this.props.field

    if(this.state.field.get('disabled')){
      const keyValue = _.find(this.state.domainValue, x => x.value === this.state.field.get("value"))
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

SelectField.propTypes = {
  field: PropTypes.object.isRequired
}

const ColorItem = ({item}) => {
  const style = {
    backgroundColor: item.value,
    width: '100%',
    height: '2rem',
  }
  return <div style={style}/>
}

ColorItem.propTypes = {
  item: PropTypes.object.isRequired
}

export class SelectColorField extends BaseSelectField {

  handleChange = (value) => {
    this.props.field.setValue( value.key )
  }

  render(){
    if(!this.state.field)return false
    let field = this.props.field

    let options = _.map(this.props.options, color => {
      return { key: color, value: color}
    })

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

SelectColorField.propTypes = {
  field:    PropTypes.object.isRequired,
  options:  PropTypes.arrayOf(PropTypes.string).isRequired
}

export class MultiSelectField extends BaseSelectField{

  handleChange = (value) => {
    this.props.field.setValue( value && value.split(',') || [] )
  }

  render(){
    if(!this.state.field) return false
    let field = this.props.field

    if(this.state.field.get('disabled')){
      const keyValue = _.find(this.state.domainValue, x => x.key === this.state.field.get('value'))
      return <TextLabel label={field.label} value={keyValue && keyValue.value}/>
    }else{
      const value = this.state.field.get('value')
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

MultiSelectField.propTypes = {
  field:        PropTypes.object.isRequired,
  allowCreate:  PropTypes.bool
}

export class AvatarViewField extends Component{
  state = {name: 'Red Pelicans'}

  componentWillUnmount(){
    this.unsubscribe()
  }

  componentWillMount(){
    this.unsubscribe = this.props.obj.onValue( state => {
      let name
      if(this.props.type === 'company')
        name = state.name.value
      else
        name = [state.firstName.value, state.lastName.value].join(' ')
      this.setState({
        type: state.avatar.type.value,
        name: name,
        color: state.avatar.color.value,
        url: state.avatar.url.error ? undefined :  state.avatar.url.value,
        src: state.avatar.src.value,
      })
    })
  }

  getAvatarType(){
    const defaultAvatar = <div className="m-r-1"><Avatar name={this.state.name} color={this.state.color}/></div>
    switch(this.state.type){
      case 'url':
        return this.state.url ? <div className="m-r-1"> <Avatar src={this.state.url}/></div> : defaultAvatar
      case 'src':
        return this.state.src ? <div className="m-r-1"><Avatar src={this.state.src}/></div> : defaultAvatar
      default:
        return defaultAvatar
    }
  }

  render(){
    return this.getAvatarType()
  }
}

AvatarViewField.propTypes = {
  obj:  PropTypes.object.isRequired,
  type: PropTypes.string
}

export class AvatarChooserField extends Component{
  state = {type: this.props.field.defaultValue}

  handleFilenameChange = (filename) => {
    this.setState({filename: filename})
  }

  componentWillUnmount(){
    this.unsubscribe()
  }

  componentDidMount(){
    this.colorField = <SelectColorField options={colors} field={this.props.field.field('color')}/>
    this.logoUrlField = <InputField field={this.props.field.field('url')} isUrl={true}/>
    this.logoFileField = <FileField filename={this.state.filename} onFilenameChange={this.handleFilenameChange} field={this.props.field.field('src')}/>

    this.unsubscribe = this.props.field.onValue( v => {
      this.setState({
        type: v.type.value,
      })
    })
  }

  getField(){
    switch(this.state.type){
      case 'url':
        return this.logoUrlField
      case 'src':
        return this.logoFileField
      default:
        return this.colorField
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

AvatarChooserField.propTypes = {
  field: PropTypes.object.isRequired
}

export class StarField extends Component{
  state = undefined

  componentWillUnmount(){
    if(this.unsubscribe) this.unsubscribe()
  }

  componentDidMount(){
    this.unsubscribe = this.props.field.onValue( v => {
      this.setState({preferred: v.value})
    })
  }

  handleChange = (e) => {
    this.props.field.setValue( !this.state.preferred )
    e.preventDefault()
  }

  render(){
    if(!this.state) return false
    let field = this.props.field
    let preferred = this.state.preferred

    let style={
      display: 'block',
      color: preferred ? '#00BCD4' : 'grey',
      fontSize: '1.5rem',
    }

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

StarField.propTypes = {
  field: PropTypes.object.isRequired
}

export class DateField extends BaseField{
  handleChange = (date) => {
    this.props.field.setValue( date )
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.field != nextState.field
      || this.props.maxDate != nextProps.maxDate
      || this.props.minDate != nextProps.minDate
  }

  render(){
    if(!this.state.field)return false
    const field = this.props.field
    const labelUrl = this.props.isUrl ? <a href={this.state.field.get('value')}><i className="fa fa-external-link p-l-1"/></a> : ""
    const props = {
      value: this.state.field.get('value'),
      onChange: this.handleChange,
      time: false,
    }
    if(this.props.minDate) props.min = this.props.minDate
    if(this.props.maxDate) props.max = this.props.maxDate
    const Picker = React.createElement(DateTimePicker, props)

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

DateField.propTypes = {
  field:    PropTypes.object.isRequired,
  minDate:  PropTypes.object,
  maxDate:  PropTypes.object,
  isUrl:    PropTypes.bool
}

export class PeriodField extends Component{
  state = {}

  componentWillUnmount(){
    this.unsubscribe1()
    this.unsubscribe2()
  }

  componentWillMount(){
    this.unsubscribe1 = this.props.startDate.onValue( state => {
      this.setState({startDate: state.value})
    })
    this.unsubscribe2 = this.props.endDate.onValue( state => {
      this.setState({endDate: state.value})
    })
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

PeriodField.propTypes = {
  startDate:  PropTypes.object,
  endDate:    PropTypes.object
}
