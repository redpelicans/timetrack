import _ from 'lodash';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import { Lifecycle } from 'react-router';
import Immutable from 'immutable';
import classNames from 'classnames';
import personForm, {colors, avatarTypes} from '../../forms/person';
import {personsStore,  personsActions} from '../../models/persons';
import {loginStore} from '../../models/login';
import {skillsActions, skillsStore} from '../../models/skills';
import {companiesStore,  companiesActions} from '../../models/companies';
import {navActions, navStore} from '../../models/nav';
import {Content} from '../layout';
import {Form, AddBtn, UpdateBtn, CancelBtn, ResetBtn} from '../widgets';
import {StarField, AvatarChooserField, AvatarViewField, MarkdownEditField, InputField, MultiSelectField, SelectField} from '../fields';
import {Header, HeaderLeft, HeaderRight, GoBack, Title} from '../widgets';
import sitemap from '../../routes';

@reactMixin.decorate(Lifecycle)
export class NewPersonApp extends Component {

  state = {
    forceLeave: false,
  }

  routerWillLeave = nextLocation => {
    if(!this.state.forceLeave && this.state.hasBeenModified) return "Are you sure you want to leave the page without saving new person?";
    return true;
  }

  handleSubmit = () => {
    this.personForm.submit();
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
    if(this.unsubscribeCompanies) this.unsubscribeCompanies();
    if(this.unsubscribeSkills) this.unsubscribeSkills();
  }

  componentWillMount() {
    this.unsubscribeCompanies = companiesStore.listen( state => {
      this.setState({companies: state.data});
    });

    this.unsubscribeSkills = skillsStore.listen( skills => {
      this.setState({skills: skills.data});
    })

    const context = navStore.getContext();
    this.personForm =  context.company ? personForm({companyId: context.company.get('_id')}) : personForm();
    this.unsubscribeSubmit = this.personForm.onSubmit( state => {
      personsActions.create(this.personForm.toDocument(state));
      this.goBack(true);
    });

    this.unsubscribeState = this.personForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      });
    });

    companiesActions.load();
    skillsActions.load();
  }

  render(){
    if(!this.personForm) return false;

    let submitBtn = <AddBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit}/>;
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>;

    return (
      <div>
        <EditContent 
          title={"Add a Person"} 
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          goBack={this.goBack}
          companies={this.state.companies}
          skills={this.state.skills}
          personForm={this.personForm}/>
      </div>
    )
  }
}


@reactMixin.decorate(Lifecycle)
export class EditPersonApp extends Component {


  state = {
    forceLeave: false,
  }

  routerWillLeave = nextLocation => {
    if(!this.state.forceLeave && this.state.hasBeenModified) return "Are you sure you want to leave the page without saving updates?";
    return true;
  }

  handleSubmit = () => {
    this.personForm.submit();
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
    if(this.unsubscribePerson) this.unsubscribePerson();
    if(this.unsubscribeCompanies) this.unsubscribeCompanies();
    if(this.unsubscribeSkills) this.unsubscribeSkills();
  }

  componentWillMount() {

    this.unsubscribeCompanies = companiesStore.listen( companies => {
      this.setState({companies: companies.data});
    });

    this.unsubscribeSkills = skillsStore.listen( skills => {
      this.setState({skills: skills.data});
    })

    const context = navStore.getContext();
    const person = context.person;
    if(!person) return navActions.replace(sitemap.person.list);
    this.personDocument = person.toJS();
    this.personForm = personForm(this.personDocument);

    this.unsubscribeSubmit = this.personForm.onSubmit( state => {
      //console.log(this.personForm.toDocument(state))
      personsActions.update(this.personDocument, this.personForm.toDocument(state));
      this.goBack(true);
    });

    this.unsubscribeState = this.personForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      });
    });

    companiesActions.load();
    skillsActions.load();
  }

  render(){
    if(!this.personDocument) return false;

    let submitBtn = <UpdateBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit && this.state.hasBeenModified}/>;
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>;

    return (
      <div>
        <EditContent 
          title={"Edit Person"} 
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          goBack={this.goBack}
          personDocument={this.personDocument} 
          companies={this.state.companies}
          skills={this.state.skills}
          personForm={this.personForm}/>
      </div>
    )
  }
}

export default class EditContent extends Component {

  componentWillMount(){
    // dynamic behavior
    emailRule(this.props.personForm);
    companyRule(this.props.personForm);
  }

  companiesValues(){
    if(!this.props.companies) return [];
    const values = _.chain(this.props.companies.toJS())
      .map(company => { return {key: company._id, value: company.name} })
      .sortBy(x => x.value)
      .value();
    values.unshift({key: undefined, value: '<No Company>'});
    return values;
  }

  render(){
    const person = this.props.personForm;
    if(!person) return false;

    let styles = {
      time: {
        fontSize: '.7rem',
        fontStyle: 'italic',
        display: 'block',
        float: 'right',
      }
    }

    const fakePerson = Immutable.fromJS(_.pick(this.props.personDocument, 'createdAt', 'updatedAt'));

    const companyId = person.field('companyId');
    companyId.schema.domainValue = this.companiesValues();

    const skills = person.field('skills');
    skills.schema.domainValue = this.props.skills && this.props.skills.toJS() || [];

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">

            <Header obj={fakePerson}>
              <HeaderLeft>
                <GoBack goBack={this.props.goBack}/>
                <AvatarViewField type='person' obj={person}/>
                <Title title={this.props.title}/>
              </HeaderLeft>
              <HeaderRight>
                {this.props.submitBtn}
                {this.props.cancelBtn}
                <ResetBtn obj={person}/>
              </HeaderRight>
            </Header>

          </div>
          <div className="col-md-12 m-b"/>
          <div className="col-md-12">
            <Form>
              <div className="row">
                <div className="col-md-3">
                  <SelectField field={person.field('prefix')}/>
                </div>
                <div className="col-md-4">
                  <InputField field={person.field('firstName')}/>
                </div>
                <div className="col-md-4">
                  <InputField field={person.field('lastName')}/>
                </div>
                <div className="col-md-1">
                  <StarField field={person.field('preferred')}/>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <SelectField field={person.field('type')}/>
                </div>
                <div className="col-md-6">
                  <InputField field={person.field('email')}/>
                </div>
                <div className="col-md-3">
                  <SelectField field={person.field('jobType')}/>
                </div>
                <div className="col-md-12">
                  <SelectField field={companyId}/>
                </div>
                <div className="col-md-12">
                  <MultiSelectField field={skills} allowCreate={true}/>
                </div>
                <div className="col-md-12">
                  <MultiSelectField field={person.field('roles')}/>
                </div>
                <AvatarChooser person={person}/>
                <div className="col-md-12">
                  <MarkdownEditField field={person.field('jobDescription')}/>
                </div>
                <div className="col-md-12">
                  <MarkdownEditField field={person.field('note')}/>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Content>
    )
  }
}

class AvatarChooser extends Component{
  componentWillMount(){
    const type = this.props.person.field('type');
    type.onValue( state => {
      this.setState({value: state.value})
    });
  }

  render(){
    if(this.state.value === 'worker'){
      return <div/>
    }else{
      return (
        <div className="col-md-12">
          <AvatarChooserField field={this.props.person.field('avatar')}/>
        </div>
      )
    }
  }
}

function companyRule(person){
  const type = person.field('type');
  const companyId = person.field('companyId');

  type.onValue( state => {
    if(state.value === 'worker'){
      companyId.setValue(loginStore.getUser().get('companyId'));
      companyId.disabled(true);
    }else{
      companyId.disabled(false);
    }
  })
}

function emailRule(person){
  const type = person.field('type');
  const email = person.field('email');

  type.onValue( state => {
    if(state.value === 'worker'){
      email.schema.required = true;
    }else{
      email.schema.required = false;
    }
    email.refresh();
  });
}

