import _ from 'lodash';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import { Lifecycle } from 'react-router';
import routes from '../../routes';
import classNames from 'classnames';
import {timeLabels} from '../helpers';
import {Content} from '../layout';
import companyForm, {colors, avatarTypes} from '../../forms/company';
import {companiesStore, companiesActions, sortMenu} from '../../models/companies';
import {Avatar, FileField, MarkdownEditField, InputField, SelectField, SelectColorField} from '../../views/widgets';

@reactMixin.decorate(Lifecycle)
export class NewCompanyApp extends Component {

  state = {
    forceLeave: false,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  routerWillLeave = nextLocation => {
    if(!this.state.forceLeave && this.state.hasBeenModified) return "Are you sure you want to leave the page without saving new company?";
    return true;
  }

  handleSubmit = () => {
    this.companyForm.submit();
  }

  handleCancel = () => {
    this.goBack(false);
  }

  goBack = (forceLeave) => {
    this.setState({forceLeave: forceLeave}, () => {
      this.props.history.goBack();
    });
  }

  componentWillUnmount(){
    this.unsubscribeSubmit();
    this.unsubscribeState();
  }

  componentWillMount() {
    this.companyForm = companyForm();


    this.unsubscribeSubmit = this.companyForm.onSubmit( state => {
      companiesActions.create(this.companyForm.toDocument(state));
      this.goBack(true);
    });

    this.unsubscribeState = this.companyForm.onValue( state => {
      console.log(state)
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      });
    });

  }

  render(){
    let submitBtn = <AddBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit}/>;
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>;

    return (
      <div>
        <EditContent 
          title={"Add a Company"} 
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          goBack={this.goBack}
          companyForm={this.companyForm}/>
      </div>
    )
  }
}


@reactMixin.decorate(Lifecycle)
export class EditCompanyApp extends Component {

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  state = {
    forceLeave: false,
  }

  routerWillLeave = nextLocation => {
    if(!this.state.forceLeave && this.state.hasBeenModified) return "Are you sure you want to leave the page without saving updates?";
    return true;
  }

  handleSubmit = () => {
    this.companyForm.submit();
  }

  handleCancel = () => {
    this.goBack(false);
  }

  goBack = (forceLeave) => {
    this.setState({forceLeave: forceLeave}, () => {
      this.props.history.goBack();
    });
  }

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit();
    if(this.unsubscribeState) this.unsubscribeState();
  }

  componentWillMount() {
    let companyId = this.props.location.state.id;

    this.companyDocument = companiesStore.getById(companyId).toJS();
    this.companyForm = companyForm(this.companyDocument);

    this.unsubscribeSubmit = this.companyForm.onSubmit( state => {
      companiesActions.update(this.companyDocument, this.companyForm.toDocument(state));
      this.goBack(true);
    });

    this.unsubscribeState = this.companyForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      });
    });
  }

  render(){
    let submitBtn = <UpdateBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit && this.state.hasBeenModified}/>;
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>;

    return (
      <div>
        <EditContent 
          title={"Edit Company"} 
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          goBack={this.goBack}
          companyDocument={this.companyDocument} 
          companyForm={this.companyForm}/>
      </div>
    )
  }
}

export default class EditContent extends Component {

  render(){
    if(!this.props.companyForm) return false;

    let styles = {
      time: {
        fontSize: '.7rem',
        fontStyle: 'italic',
        display: 'block',
        float: 'right',
      }
    }

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">
            <Header company={this.props.companyForm} title={this.props.title} goBack={this.props.goBack}>
              {this.props.submitBtn}
              {this.props.cancelBtn}
              <ResetBtn company={this.props.companyForm}/>
            </Header>
          </div>
          <div className="col-md-12">
            <div style={styles.time} >
              {timeLabels(this.props.companyDocument)}
            </div>
          </div>
          <div className="col-md-12 m-b"/>
          <div className="col-md-12">
            <Form>
              <div className="row">
                <div className="col-md-9">
                  <InputField field={this.props.companyForm.field('name')}/>
                </div>
                <div className="col-md-1">
                  <StarField field={this.props.companyForm.field('starred')}/>
                </div>
                <div className="col-md-2">
                  <SelectField field={this.props.companyForm.field('type')}/>
                </div>
                <div className="col-md-12">
                <AvatarChooser field={this.props.companyForm.field('avatar')}/>
                </div>
                <div className="col-md-12">
                  <InputField field={this.props.companyForm.field('website')} isUrl={true}/>
                </div>
                <div className="col-md-12">
                  <InputField field={this.props.companyForm.field('address/street')}/>
                </div>
                <div className="col-md-4">
                  <InputField field={this.props.companyForm.field('address/zipcode')}/>
                </div>
                <div className="col-md-4">
                  <InputField field={this.props.companyForm.field('address/city')}/>
                </div>
                <div className="col-md-4">
                  <InputField field={this.props.companyForm.field('address/country')}/>
                </div>
                <div className="col-md-12">
                  <MarkdownEditField field={this.props.companyForm.field('note')}/>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Content>
    )
  }
}


class Header extends Component{
  render(){
    const styles={
      container:{
        paddingTop: '1rem',
        display: 'flex',
        justifyContent: "space-between",
      flexWrap: 'wrap',
      },
      left:{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        minWidth: '500px',
      },
      right:{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1,
      },
      name:{
        flexShrink: 0,
      },
    }

    const handleClick = (e) => {
      e.preventDefault();
      this.props.goBack();
    }

    return (
      <div>
        <div style={styles.container} className="tm title">
          <div style={styles.left}>
            <div style={styles.goBack}>
              <a href="#" className="fa fa-arrow-left m-r" onClick={handleClick}/>
            </div>
            <div  className="m-r">
              <AvatarView company={this.props.company}/>
            </div>
            <div style={styles.name} className="m-r">
              {this.props.title}
            </div>
          </div>
          <div style={styles.right}>
            {this.props.children}
          </div>
        </div>
        <hr/>
      </div>
    )
  }
}


class AvatarChooser extends Component{
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

class StarField extends Component{
  state = undefined;

  componentWillUnmount(){
    this.unsubscribe();
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

class AvatarView extends Component{
  state = {name: 'Red Pelicans'}

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentWillMount(){

    this.unsubscribe = this.props.company.onValue( state => {
      this.setState({
        type: state.avatar.type.value,
        name: state.name.value,
        color: state.avatar.color.value,
        url: state.avatar.url.error ? undefined :  state.avatar.url.value,
        src: state.avatar.src.value,
      })
    });
  }

  getAvatarType(){
    const defaultAvatar = <Avatar name={this.state.name} color={this.state.color}/>;
    switch(this.state.type){
      case 'url':
        return this.state.url ? <Avatar src={this.state.url}/> : defaultAvatar;
      case 'src':
        return this.state.src ? <Avatar src={this.state.src}/> : defaultAvatar;
      default:
        return defaultAvatar;
    }
  }

  render(){
    return this.getAvatarType();
  }
}


const Form = ({children}) => {
  return(
    <form>
      {children}
    </form>
  )
}

const AddBtn = ({onSubmit, canSubmit}) => {
  const handleChange = (e) => {
    onSubmit();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-primary m-l" disabled={!canSubmit} onClick={handleChange}>Create</button>
  )
}

const UpdateBtn = ({onSubmit, canSubmit}) => {
  const handleChange = (e) => {
    onSubmit();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-primary m-l" disabled={!canSubmit} onClick={handleChange}>Update</button>
  )
}

const CancelBtn = ({onCancel}) => {
  const handleChange = (e) => {
    onCancel();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-warning m-l" onClick={handleChange}>Cancel</button>
  )
}

const ResetBtn = ({company}) => {
  const handleChange = (e) => {
    company.reset();
    e.preventDefault();
  }

  return (
    <button type="button" className="btn btn-danger m-l"  onClick={handleChange}>Reset</button>
  )
}


