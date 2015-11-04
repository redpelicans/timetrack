import _ from 'lodash';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import { Lifecycle } from 'react-router';
import routes from '../../routes';
import classNames from 'classnames';
import Avatar from '../avatar';
import {Content, Header, Actions} from '../layout';
import companyForm, {colors} from '../../forms/company';
import companies from '../../models/companies';
import {InputField, SelectField, SelectColorField} from '../../utils/formo_fields';

@reactMixin.decorate(Lifecycle)
export class NewCompanyApp extends Component {

  state = {
    canLeavePage: false,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  routerWillLeave = nextLocation => {
    //return "Are you sure you want to leave the page ?"
    if(this.state.canLeavePage)return true;
    this.companyForm.cancel({dest: nextLocation.pathname});
    return false;
  }

  componentWillUnmount(){
    this.unsubscribeCancel();
    this.unsubscribeSubmit();
  }

  leavePage(dest){
    console.log( dest || this.state.nextLocation);
    this.state.canLeavePage = true;
    this.props.history.pushState(null, dest || this.state.nextLocation);
  }

  get companyPath(){
    return routes.companies.path;
  }

  componentWillMount() {
    this.companyForm = companyForm();
    this.unsubscribeSubmit = this.companyForm.submitted.onValue(state => {
      companies.create(this.companyForm.toJS(state));
      this.leavePage(this.companyPath);
    });
    this.unsubscribeCancel = this.companyForm.cancelled.onValue(state => {
      if(!state.hasBeenModified){
        this.leavePage(state.cancelOptions.dest);
      }else{
        this.state.nextLocation = state.cancelOptions.dest;
        $('#cancelModal').modal('show');
      }
    });
  }

  componentDidMount(){
    $('#cancelModal').modal({show: false});
  }

  render(){
    return (
      <div>
        <EditCompanyContent title={"Add a Company"} companyForm={this.companyForm}/>
        <CancelModal action={this.leavePage.bind(this)}/>
      </div>
    )
  }
}

export class EditCompanyApp extends Component {
}

export default class EditCompanyContent extends Component {

  render(){
    // let href = this.context.history.createHref(routes.companies.path);
    // let leftIcon = <a href={href} className="fa fa-arrow-left m-r"/>;
    let leftIcon = <i className="fa fa-building m-r"/>;

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">
            <Header leftIcon={leftIcon} title={this.props.title}>
              <Actions>
                <AddBtn company={this.props.companyForm}/>
                <CancelBtn company={this.props.companyForm}/>
                <ResetBtn company={this.props.companyForm}/>
              </Actions>
            </Header>
          </div>
          <div className="col-md-12">
            <Form>
              <div className="row">
                <div className="col-md-9">
                  <InputField field={this.props.companyForm.field('name')}/>
                </div>
                <div className="col-md-3">
                  <SelectField field={this.props.companyForm.field('type')}/>
                </div>
              </div>
              <div className="row">
                <div className="col-md-9">
                  <InputField field={this.props.companyForm.field('logoUrl')}/>
                </div>
                <div className="col-md-1">
                  <AvatarField company={this.props.companyForm}/>
                </div>
                <div className="col-md-2">
                  <SelectColorField options={colors} field={this.props.companyForm.field('color')}/>
                </div>
                <div className="col-md-12">
                  <InputField field={this.props.companyForm.field('price')}/>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Content>
    )
  }

}

class CancelModal extends Component{
  handleClick = (e) => {
    this.props.action();
    e.preventDefault();
  }

  render(){
    return (
      <div className="modal fade" id="cancelModal" tabIndex="-1" role="dialog" aria-labelledby="cancelModalTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
               <h4 className="modal-title" id="cancelModalTitle">New Company </h4>
            </div>
            <div className="modal-body">
              Fields have been modified, do you really wan't to leave this page without saving ?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Continu</button>
              <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={this.handleClick}>Leave</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class AvatarField extends Component{
  state = {name: 'Red Pelicans'}

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentWillMount(){
    this.unsubscribe = this.props.company.state.onValue( state => {
      this.setState({
        name: state.name.value,
        color: state.color.value,
        src: state.logoUrl.error ? undefined :  state.logoUrl.value,
      })
    });
  }

  render(){
    let avatarStyle={marginLeft: 'auto', marginRight: 'auto'};
    return (
      <fieldset className="form-group">
        <label htmlFor="avatar" >Avatar</label>
        <Avatar 
          id="avatar" 
          src={this.state.src} 
          name={this.state.name}
          color={this.state.color}
          css={avatarStyle}/> 
      </fieldset>
    )
  }
}

class Form extends Component {
  render(){
    return(
      <form>
        {this.props.children}
      </form>
    )
  }
}

class AddBtn extends Component {
  state = undefined;

  handleChange = (e) => {
    this.props.company.submit();
    e.preventDefault();
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  componentWillMount(){
    this.unsubscribe = this.props.company.state.onValue(state => {
      this.setState({canSubmit: state.canSubmit});
    });
  }

  render(){
    if(!this.state) return false;
    let style={};
    return (
      <button type="button" className="btn btn-primary m-l" disabled={!this.state.canSubmit} onClick={this.handleChange} style={style}>Create</button>
    )
  }
}

class CancelBtn extends Component {

  handleChange = (e) => {
    this.props.company.cancel({dest: routes.companies.path});
    e.preventDefault();
  }

  render(){
    let style={};
    return (
      <button type="button" className="btn btn-warning m-l" onClick={this.handleChange} >Cancel</button>
    )
  }
}



class ResetBtn extends Component {
  handleChange = (e) => {
    this.props.company.reset();
    e.preventDefault();
  }

  render(){
    return (
      <button type="button" className="btn btn-danger m-l"  onClick={this.handleChange}>Reset</button>
    )
  }
}


