import _ from 'lodash';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import { Lifecycle } from 'react-router';
import Immutable from 'immutable';
import {Content} from '../layout';
import companyForm, {colors, avatarTypes} from '../../forms/company';
import {companiesActions} from '../../models/companies';
import {companyActions, companyStore} from '../../models/company';
import {navActions} from '../../models/nav';
import {Form, AddBtn, UpdateBtn, CancelBtn, ResetBtn, StarField, AvatarChooserField, AvatarViewField, MarkdownEditField, InputField, SelectField} from '../../views/widgets';
import {Header, HeaderLeft, HeaderRight, GoBack, Title } from '../widgets';

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
      navActions.goBack();
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
      navActions.goBack();
    });
  }

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit();
    if(this.unsubscribeState) this.unsubscribeState();
    this.unsubscribeCompany();
  }

  componentWillMount() {
    this.unsubscribeCompany = companyStore.listen( ctx => {
      const company = ctx.company;
      if(!company) return navActions.replace('companies');
      if(!this.companyDocument){
        this.companyDocument = company.toJS();
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
    });

    companyActions.load();
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

    const fake = Immutable.fromJS(_.pick(this.props.companyDocument, 'createdAt', 'updatedAt'));
    const styles = {
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

            <Header obj={fake}>
              <HeaderLeft>
                <GoBack goBack={this.props.goBack}/>
                <AvatarViewField type={"company"} obj={this.props.companyForm}/>
                <Title title={this.props.title}/>
              </HeaderLeft>
              <HeaderRight>
                {this.props.submitBtn}
                {this.props.cancelBtn}
                <ResetBtn obj={this.props.companyForm}/>
              </HeaderRight>
            </Header>

          </div>
          <div className="col-md-12 m-b"/>
          <div className="col-md-12">
            <Form>
              <div className="row">
                <div className="col-md-9">
                  <InputField field={this.props.companyForm.field('name')}/>
                </div>
                <div className="col-md-1">
                  <StarField field={this.props.companyForm.field('preferred')}/>
                </div>
                <div className="col-md-2">
                  <SelectField field={this.props.companyForm.field('type')}/>
                </div>
                <div className="col-md-12">
                <AvatarChooserField field={this.props.companyForm.field('avatar')}/>
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


