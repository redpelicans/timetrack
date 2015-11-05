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
    this.goToCompanies(false);
  }

  goToCompanies = (forceLeave) => {
    this.setState({forceLeave: forceLeave}, () => {
      this.props.history.pushState(null, routes.companies.path);
    });
  }

  componentWillUnmount(){
    this.unsubscribeSubmit();
    this.unsubscribeState();
  }

  componentWillMount() {
    this.companyForm = companyForm();

    this.unsubscribeSubmit = this.companyForm.submitted.onValue(state => {
      companies.create(this.companyForm.toJS(state));
      this.goToCompanies(true);
    });

    this.unsubscribeState = this.companyForm.state.onValue(state => {
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
        <EditCompanyContent 
          title={"Add a Company"} 
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
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
    this.goToCompanies(false);
  }

  goToCompanies = (forceLeave) => {
    this.setState({forceLeave: forceLeave}, () => {
      this.props.history.pushState(null, routes.companies.path);
    });
  }

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit();
    if(this.unsubscribeState) this.unsubscribeState();
  }

  componentWillMount() {
    let companyId = this.props.location.state.id;
    companies.loadOne(companyId).onValue(company => {
      this.companyDocument = company.toJS();
      this.companyForm = companyForm(this.companyDocument);

      this.unsubscribeSubmit = this.companyForm.submitted.onValue(state => {
        companies.update(this.companyDocument, this.companyForm.toJS(state));
        this.goToCompanies(true);
      });

      this.unsubscribeState = this.companyForm.state.onValue(state => {
        this.setState({
          canSubmit: state.canSubmit,
          hasBeenModified: state.hasBeenModified,
        });
      });
    });
  }

  render(){
    console.log(this.state);
    let submitBtn = <UpdateBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit && this.state.hasBeenModified}/>;
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>;

    return (
      <div>
        <EditCompanyContent 
          title={"Edit Company"} 
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          companyDocument={this.companyDocument} 
          companyForm={this.companyForm}/>
      </div>
    )
  }
}

export default class EditCompanyContent extends Component {

  createdAtAndupdatedAtLabel(){
    if(this.props.companyDocument){
      let [createdAt, updatedAt] = [this.props.companyDocument.createdAt, this.props.companyDocument.updatedAt];
      let createdAtLabel = <span>Created {createdAt.fromNow()}</span>;
      let updatedAtLabel = createdAt != updatedAt ? <span>Updated {updatedAt.fromNow()}</span> : '';
      return [createdAtLabel, updatedAtLabel];
    }else{
      return [];
    }
  }

  render(){
    let leftIcon = <i className="fa fa-building m-r"/>;
    let styles = {
      time: {
        fontSize: '.7rem',
        fontStyle: 'italic',
        display: 'block',
        float: 'right',
      }
    }
    let [createdAtLabel, updatedAtLabel] = this.createdAtAndupdatedAtLabel();

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">
            <Header leftIcon={leftIcon} title={this.props.title}>
              <Actions>
                {this.props.submitBtn}
                {this.props.cancelBtn}
                <ResetBtn company={this.props.companyForm}/>
              </Actions>
            </Header>
          </div>
          <div className="col-md-12">
            <div style={styles.time} >
              {createdAtLabel}
            </div>
          </div>
          <div className="col-md-12">
            <div style={styles.time} >
              {updatedAtLabel}
            </div>
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

// class CancelModal extends Component{
//   handleClick = (e) => {
//     this.props.onConfirm();
//     e.preventDefault();
//   }
//
//   render(){
//     return (
//       <div className="modal fade" id="cancelModal" tabIndex="-1" role="dialog" aria-labelledby="cancelModalTitle" aria-hidden="true">
//         <div className="modal-dialog" role="document">
//           <div className="modal-content">
//             <div className="modal-header">
//               <button type="button" className="close" data-dismiss="modal" aria-label="Close">
//                 <span aria-hidden="true">&times;</span>
//                 <span className="sr-only">Close</span>
//               </button>
//                <h4 className="modal-title" id="cancelModalTitle">New Company </h4>
//             </div>
//             <div className="modal-body">
//               Fields have been modified, do you really wan't to leave this page without saving ?
//             </div>
//             <div className="modal-footer">
//               <button type="button" className="btn btn-secondary" data-dismiss="modal">Continu</button>
//               <button type="button" className="btn btn-warning" data-dismiss="modal" onClick={this.handleClick}>Leave</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

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
  handleChange = (e) => {
    this.props.onSubmit();
    e.preventDefault();
  }

  render(){
    let style={};
    return (
      <button type="button" className="btn btn-primary m-l" disabled={!this.props.canSubmit} onClick={this.handleChange} style={style}>Create</button>
    )
  }
}

class UpdateBtn extends Component {
  handleChange = (e) => {
    this.props.onSubmit();
    e.preventDefault();
  }

  render(){
    let style={};
    return (
      <button type="button" className="btn btn-primary m-l" disabled={!this.props.canSubmit} onClick={this.handleChange} style={style}>Update</button>
    )
  }
}

class CancelBtn extends Component {
  handleChange = (e) => {
    this.props.onCancel();
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


