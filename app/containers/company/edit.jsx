import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import reactMixin from 'react-mixin';
import Immutable from 'immutable';
import companyForm, {colors, avatarTypes} from '../../forms/company';
import {Content} from '../../components/layout';
import {Form, AddBtn, UpdateBtn, CancelBtn, ResetBtn} from '../../components/widgets';
import {Header, HeaderLeft, HeaderRight, GoBack, Title } from '../../components/widgets';
import {ComboboxField, StarField, AvatarChooserField, AvatarViewField, MarkdownEditField, InputField, DropdownField} from '../../components/fields';
import CityField from '../cities';
import CountryField from '../countries';
import TagsField from '../tags';
import sitemap from '../../routes';
import {companiesActions} from '../../actions/companies';
import {goBack, pushRoute, replaceRoute} from '../../actions/routes';
import {editCompanySelector} from '../../selectors/companies';

class NewCompany extends Component {

  state = {
    forceLeave: false,
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
      this.props.dispatch(goBack());
    });
  }

  componentDidMount(){
    const { route } = this.props;
    const { router } = this.context;
    router.setRouteLeaveHook(route, this.routerWillLeave);
  }

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit();
    if(this.unsubscribeState) this.unsubscribeState();
  }

  componentWillMount() {
    this.companyForm = companyForm();

    this.unsubscribeSubmit = this.companyForm.onSubmit( (state, document) => {
      this.props.dispatch(companiesActions.create(document));
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

NewCompany.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

NewCompany.PropTypes = {
  dispatch: PropTypes.func.isRequired,
}



class EditCompany extends Component {
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
      this.props.dispatch(goBack());
    });
  }

  componentDidMount(){
    const { route } = this.props;
    const { router } = this.context;
    router.setRouteLeaveHook(route, this.routerWillLeave);
  }

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit();
    if(this.unsubscribeState) this.unsubscribeState();
  }

  componentWillMount() {
    const {company, dispatch} = this.props;

    if(!company) dispatch(replaceRoute(sitemap.company.list));

    this.companyDocument = company.toJS();
    this.companyForm = companyForm(this.companyDocument);

    this.unsubscribeSubmit = this.companyForm.onSubmit( (state, document) => {
      dispatch(companiesActions.update(this.companyDocument, document));
      this.goBack(true);
    });

    this.unsubscribeState = this.companyForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      });
    });

   //dispatch(companiesActions.load({ids: [companyId]}));
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

EditCompany.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

EditCompany.PropTypes = {
  dispatch: PropTypes.func.isRequired,
  companyId: PropTypes.string.isRequired,
  company: PropTypes.object.isRequired,
}

export default class EditContent extends Component {
  render(){
    if(!this.props.companyForm) return false;
    const editMode = !!this.props.companyDocument;
    const fake = Immutable.fromJS(_.pick(this.props.companyDocument, 'createdAt', 'updatedAt'));
    const styles = {
      time: {
        fontSize: '.7rem',
        fontStyle: 'italic',
        display: 'block',
        float: 'right',
      }
    }

    const note = () => {
      if(editMode)return <div/>;
      return (
        <div className="col-md-12">
          <MarkdownEditField field={this.props.companyForm.field('note')}/>
        </div>
      )
    }

    const tags = () => {
      if(editMode)return <div/>;
      return (
        <div className="col-md-12">
          <TagsField field={this.props.companyForm.field('tags')}/>
        </div>
      )
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
                  <DropdownField field={this.props.companyForm.field('type')}/>
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
                  <CityField field={this.props.companyForm.field('address/city')}/>
                </div>
                <div className="col-md-4">
                  <CountryField field={this.props.companyForm.field('address/country')}/>
                </div>
                {tags()}
                {note()}
              </div>
            </Form>
          </div>
        </div>
      </Content>
    )
  }
}

EditContent.PropTypes = {
  title: PropTypes.string.isRequired,
  submitBtn: PropTypes.func.isRequired,
  cancelBtn: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  companyForm: PropTypes.object.isRequired,
  companyDocument: PropTypes.object,
}
export const NewCompanyApp =  connect()(NewCompany);
export const EditCompanyApp = connect(editCompanySelector)(EditCompany);
