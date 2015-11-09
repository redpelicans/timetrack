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
export default class NewCompanyApp extends Component {

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  routerWillLeave(nextLocation){
    //return "Are you sure you want to leave the page ?"
    return true;
  }

  componentWillUnmount(){
    this.unsubscribeCancel();
    this.unsubscribeSubmit();
  }

  goBack = () => {
    this.props.history.pushState(null, routes.companies.path);
  }

  componentWillMount() {
    this.newCompany = companyForm();
    this.unsubscribeSubmit = this.newCompany.submitted.onValue(state => {
      companies.create(this.newCompany.toJS(state));
      this.goBack();
    });
    this.unsubscribeCancel = this.newCompany.cancelled.onValue(state => {
      if(!state.hasBeenModified){
        this.goBack();
      }else{
        $('#cancelModal').modal('show');
      }
    });
  }

  componentDidMount(){
    $('#cancelModal').modal({show: false});
  }

  render(){
    let href = this.context.history.createHref(routes.companies.path);
    let leftIcon = <a href={href} className="fa fa-arrow-left m-r"/>;

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">
            <Header leftIcon={leftIcon} title={'Add a Company'}>
              <Actions>
                <AddBtn company={this.newCompany}/>
                <CancelBtn company={this.newCompany}/>
                <ResetBtn company={this.newCompany}/>
              </Actions>
            </Header>
          </div>
          <div className="col-md-12">
            <Form>
              <div className="row">
                <div className="col-md-9">
                  <InputField field={this.newCompany.field('name')}/>
                </div>
                <div className="col-md-3">
                  <SelectField field={this.newCompany.field('type')}/>
                </div>
              </div>
              <div className="row">
                <div className="col-md-9">
                  <InputField field={this.newCompany.field('logoUrl')}/>
                </div>
                <div className="col-md-1">
                  <AvatarField company={this.newCompany}/>
                </div>
                <div className="col-md-2">
                  <SelectColorField options={colors} field={this.newCompany.field('color')}/>
                </div>
                <div className="col-md-12">
                  <InputField field={this.newCompany.field('price')}/>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <CancelModal action={this.goBack}/>
      </Content>
    )
  }

}

class CancelModal extends Component{
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
              <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={this.props.action}>Leave</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class AvatarField extends Component{
  state = {name: 'Red Pelicans'};

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
    this.props.company.cancel();
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


