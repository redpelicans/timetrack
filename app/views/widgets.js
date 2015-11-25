import React, {Component} from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import FileInput from 'react-file-input';
import Remarkable from 'remarkable';
import {colors} from '../forms/company';


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
    console.log("render " + this.props.field.label)
    let field = this.props.field;
    let message = () => {
      if(this.state.error) return this.state.error;
      if(this.state.isLoading) return 'Loading ...';
    }
    let hasError = () => {
      return this.state.error || this.props.field.isRequired() && this.props.field.isNull(this.state.value);
    }

    const fieldsetClassNames = classNames( "form-group", { 'has-error': hasError() });
    const selectClassNames= classNames( 'tm select form-control', { 'form-control-error': hasError() });
    const options = _.map(field.domainValue, ({key, value}) => {return {label:value, value:key}} );

    if(this.state.disabled){
      const keyValue = _.find(field.domainValue, x => x.key === this.state.value);
      return <TextLabel label={field.label} value={keyValue && keyValue.value}/>
    }else{
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

export const AvatarView = ({obj}) => {
  if(!obj || !obj.get('avatar')) return <Avatar name={"?"}/>;

  const avatar = obj.get('avatar').toJS();
  console.log("AvatarView")
  const defaultAvatar = <div className="m-r"><Avatar name={obj.get('name')} color={avatar.color}/></div>;

  switch(avatar.type){
    case 'url':
      return avatar.url ? <div className="m-r"><Avatar src={avatar.url}/></div> : defaultAvatar;
    case 'src':
      return avatar.src ? <div className="m-r"><Avatar src={avatar.src}/></div> : defaultAvatar;
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

export const TextLabel = ({label, value, url, onClick}) => {
  const labelUrl = () => {
    if(!url && !onClick) return "";
    if(onClick) return <a href="#" onClick={onClick}><i className="fa fa-external-link p-l"/></a>;
    if(url) return <a href={url}><i className="fa fa-external-link p-l"/></a>;
  }

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
      <div style={{height: '100%', minHeight: '36px'}}className="form-control" id={label} dangerouslySetInnerHTML={text}/>
    </fieldset>
  )
}

export const Edit = ({onEdit}) => {
  const handleChange = (e) => {
    onEdit();
    e.preventDefault();
  }

  return (
    <a href="#" onClick={handleChange}>
      <i className="iconButton fa fa-pencil m-r"/>
    </a>
  )
}

export const AddPerson =({onAdd}) => {
  const handleChange = (e) => {
    onAdd();
    e.preventDefault();
  }

  return (
    <a href="#" onClick={handleChange}>
      <i className="iconButton fa fa-user-plus m-r"/>
    </a>
  )
}

export const LeaveCompany =({onLeaveCompany}) => {
  const handleChange = (e) => {
    onLeaveCompany();
    e.preventDefault();
  }

  return (
    <a href="#" onClick={handleChange}>
      <i className="iconButton fa fa-sign-out m-r"/>
    </a>
  )
}

export const Delete =({onDelete}) => {
  const handleChange = (e) => {
    onDelete();
    e.preventDefault();
  }

  return (
    <a href="#" onClick={handleChange}>
      <i className="iconButton fa fa-trash m-r"/>
    </a>
  )
}

export const GoBack =({goBack, history}) => {
  const handleChange = (e) => {
    if(goBack) goBack();
    else history.goBack();
    e.preventDefault();
  }

  return (
    <a href="#" onClick={handleChange}>
      <i className="iconButton fa fa-arrow-left m-r"/>
    </a>
  )
}

export const Title =({title}) => {
  const styles={
    name:{
      flexShrink: 0,
    },
  }

  return (
    <div style={styles.name} className="m-r">
      {title}
    </div>
  )
}

export const Preferred = ({obj, onTogglePreferred}) => {
  const handleChange = (e) => {
    onTogglePreferred(obj);
    e.preventDefault();
  }

  const classnames = classNames("iconButton star fa fa-star-o m-r", {
    preferred: obj.get('preferred'),
  });

  if(onTogglePreferred){
    return (
      <a href="#" onClick={handleChange}>
        <i className={classnames}/>
      </a>
    )
  }else{
    return (
      <i className={classnames}/>
    )

  }
}

export class PersonPreview extends Component {
  shouldComponentUpdate(nextProps, nextState){
    return this.props.person !== nextProps.person || this.props.company !== nextProps.company;
  }

  handleViewPerson = (e) => {
    this.props.onViewPerson(this.props.person);
    e.preventDefault();
  }

  handleViewCompany = (company, e) => {
    this.props.onViewCompany(company);
    e.preventDefault();
  }

  render() {
    console.log("render Person")
    function phone(person){
      if(!person.phones || !person.phones.length) return '';
      const {label, phone} = person.phones[0];
      return `tel. ${label}: ${phone}`;
    }
    
    const company = () => {
      const company = this.props.company;
      if(!company) return '';
      return <div style={styles.company} className="p-r"> <a href="#" onClick={this.handleViewCompany.bind(null, company)}>{company.get('name')}</a> </div> ;
    }

    const styles = {
      container:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
      },
      containerLeft:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        padding: '5px',
      },
      containerRight:{
        display: 'flex',
        justifyContent: 'right',
        alignItems: 'center',
        padding: '5px',
      },
      names:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
      name:{
      },
      company:{
        fontStyle: 'italic',
      }
    };

    const person = this.props.person;
    const avatar = <AvatarView obj={person}/>;
    const isNew = person.get('isNew') ? <span className="label label-success">new</span> : <div/>
    //const children = React.Children.map( this.props.children, child =>  React.cloneElement( child, {obj: person}) );
    
    return (
      <div style={styles.container} >
        <div style={styles.containerLeft}>
          <div className="p-r">
            <a href="#" onClick={this.handleViewPerson}>{avatar}</a>
          </div>
          <div style={styles.names}>
            <div style={styles.name} className="p-r">
              <a href="#" onClick={this.handleViewPerson}>{person.get('name')}</a>
            </div>
            {company()}
          </div>
          <div className="p-r">
            {isNew}
          </div>
        </div>
        <div style={styles.containerRight} href="#">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export const HeaderLeft = ({children}) => {
  const styles={
    left:{
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      minWidth: '500px',
    },
  }

  return (
    <div style={styles.left}>
      {children}
    </div>
  )
}

export const HeaderRight = ({children}) => {
  const styles={
    right:{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
    },
  }

  return (
    <div style={styles.right}>
      {children}
    </div>
  )
}

export const Header = ({obj, children}) => {
  const styles={
    container:{
      paddingTop: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    name:{
      flexShrink: 0,
    },
    time: {
      fontSize: '.7rem',
      fontStyle: 'italic',
      display: 'block',
      float: 'right',
    },
  }

  const left = () => {
    return React.Children.toArray(children).find(child => child.type === HeaderLeft);
  };

  const right = () => {
    return React.Children.toArray(children).find(child => child.type === HeaderRight);
  };

  const timeLabels = (obj) => {
    if(!obj || !obj.get('createdAt'))return <span/>;
    const res = [`Created ${obj.get('createdAt').fromNow()}`];
    if(obj.get('updatedAt')) res.push(`Updated ${obj.get('updatedAt').fromNow()}`);
    return <span>{res.join(' - ')}</span>
  }

  const time = () => {
    if(!obj) return "";
    return (
      <div style={styles.time} >
        {timeLabels(obj)}
      </div>
    );
  };

  return (
    <div>
      <div style={styles.container} className="tm title">
        {left()}
        {right()}
      </div>
      <hr/>
      {time()}
    </div>
  )
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

export const Form = ({children}) => {
  return(
    <form>
      {children}
    </form>
  )
}

export const AddBtn = ({onSubmit, canSubmit}) => {
  const handleChange = (e) => {
    onSubmit();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-primary m-l" disabled={!canSubmit} onClick={handleChange}>Create</button>
  )
}

export const UpdateBtn = ({onSubmit, canSubmit}) => {
  const handleChange = (e) => {
    onSubmit();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-primary m-l" disabled={!canSubmit} onClick={handleChange}>Update</button>
  )
}

export const CancelBtn = ({onCancel}) => {
  const handleChange = (e) => {
    onCancel();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-warning m-l" onClick={handleChange}>Cancel</button>
  )
}

export const ResetBtn = ({obj}) => {
  const handleChange = (e) => {
    obj.reset();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-danger m-l"  onClick={handleChange}>Reset</button>
  )
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

export const Refresh =({onClick}) => {
  const handleChange = (e) => {
    onClick();
    e.preventDefault();
  }

  const style={
    fontSize: '1.5rem',
  }

  return (
    <div className="m-l">
      <a href="#" onClick={handleChange}>
        <i style={style} className="iconButton fa fa-refresh"/>
      </a>
    </div>
  )
}

export const Filter =({filter, onChange}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
    e.preventDefault();
  }

  const icon= <span className="fa fa-search"/>
  return (
    <div className="m-l">
      <input className="tm input form-control" type='text' value={filter} placeholder='search ...' onChange={handleChange}/>
    </div>
  )
}

export const FilterPreferred =({preferred, onClick}) => {
  const handleChange = (e) => {
    onClick();
    e.preventDefault();
  }

  const style={
    fontSize: '1.5rem',
    color: preferred ? '#00BCD4' : 'grey',
  }

  return (
    <div className="m-l">
      <a href="#" onClick={handleChange} > 
        <i style={style} className="iconButton fa fa-star-o"/>
      </a>
    </div>
  )
}

export const Sort =({sortMenu, sortCond, onClick}) => {
  const handleClick = (mode, e) => {
    onClick(mode);
    e.preventDefault();
  }

  function getSortIcon(sortCond, item){
    if(item.key === sortCond.by){
      const classnames = sortCond.order === "desc" ? "fa fa-sort-desc p-l" : "fa fa-sort-asc p-l";
      return <i className={classnames}/>
    }
  }

  const styles = {
    button:{
      fontSize: '1.5rem',
    },
    menu:{
      marginTop: '15px',
    }
  }

  const menu = _.map(sortMenu, item => {
    return (
      <a key={item.key} className="dropdown-item p-a" href="#" onClick={handleClick.bind(null, item.key)}>
        {item.label}
        {getSortIcon(sortCond, item)}
      </a>
    )
  });

  return (
    <div className="dropdown m-l">
      <a href="#"  id="sort-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> 
        <i style={styles.button} className="iconButton fa fa-sort" />
      </a>
      <ul style={styles.menu} className="dropdown-menu dropdown-menu-right" aria-labelledby="sort-menu">
        {menu}
      </ul>
    </div>
  )
}

export class AddButton extends Component {
  componentDidMount(){
    $('#addObject').tooltip({animation: true});
  }

  handleClick = () => {
    $('#addObject').tooltip('hide');
    this.props.onAdd();
  }

  render(){
    const style = {
        position: 'fixed',
        display: 'block',
        right: 0,
        bottom: 0,
        marginRight: '30px',
        marginBottom: '30px',
        zIndex: '900',
    }

    return (
      <button id="addObject" type="button" className="btn-primary btn"  data-toggle="tooltip" data-placement="left" title={this.props.title} style={style}  onClick={this.handleClick}>
        <i className="fa fa-plus"/>
      </button>
    )
  }
}


