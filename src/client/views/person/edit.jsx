import _ from 'lodash'
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import { Lifecycle } from 'react-router';
import Immutable from 'immutable';
import personForm, {colors, avatarTypes} from '../../forms/person';
import {personsStore,  personsActions} from '../../models/persons';
import {loginStore} from '../../models/login';
import {skillsActions, skillsStore} from '../../models/skills';
import {companiesStore,  companiesActions} from '../../models/companies';
import {navActions, navStore} from '../../models/nav';
import {Content} from '../layout';
import {Form, AddBtn, UpdateBtn, CancelBtn, ResetBtn} from '../widgets';
import {TagsField, StarField, AvatarChooserField, AvatarViewField, MarkdownEditField, InputField, MultiSelectField, DropdownField} from '../fields';
import {PhonesField} from '../phone';
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
    let companyId = this.props.location.state && this.props.location.state.companyId;
    this.personForm =  companyId ? personForm({companyId}) : personForm();

    this.unsubscribeCompanies = companiesStore.listen( companies => {
      const companyId = this.personForm.field('companyId');
      companyId.setSchemaValue('domainValue', companiesDomain(companies.data));
      this.forceUpdate();
    });

    this.unsubscribeSkills = skillsStore.listen( skills => {
      const skillsField = this.personForm.field('skills');
      skillsField.setSchemaValue('domainValue', skills.data.toJS() || []);
      this.forceUpdate();
    })

    this.unsubscribeSubmit = this.personForm.onSubmit( (state, document) => {
      personsActions.create(document);
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
    if(this.unsubscribeCompanies) this.unsubscribeCompanies();
    if(this.unsubscribeSkills) this.unsubscribeSkills();
    if(this.unsubscribePersons) this.unsubscribePersons();
  }

  componentWillMount() {
    let personId = this.props.location.state && this.props.location.state.personId;

    this.unsubscribePersons = personsStore.listen( persons => {
      const person = persons.data.get(personId);
      if(!person) return navActions.replace(sitemap.person.list);
      if(!this.personDocument){
        this.personDocument = person.toJS();
        this.personForm = personForm(this.personDocument);

        this.unsubscribeCompanies = companiesStore.listen( companies => {
          const companyId = this.personForm.field('companyId');
          companyId.setSchemaValue('domainValue', companiesDomain(companies.data));
          this.forceUpdate();
        });

        this.unsubscribeSkills = skillsStore.listen( skills => {
          const skillsField = this.personForm.field('skills');
          skillsField.setSchemaValue('domainValue', skills.data.toJS() || []);
          this.forceUpdate();
        })

        this.unsubscribeSubmit = this.personForm.onSubmit( (state, document) => {
          personsActions.update(this.personDocument, document);
          this.goBack(true);
        });

        this.unsubscribeState = this.personForm.onValue( state => {
          this.setState({
            canSubmit: state.canSubmit,
            hasBeenModified: state.hasBeenModified,
          });
        });
      }
    });

    if(personId){
      personsActions.load({ids: [personId]});
      companiesActions.load();
      skillsActions.load();
    }else return navActions.replace(sitemap.person.list);

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
          personForm={this.personForm}/>
      </div>
    )
  }
}

export default class EditContent extends Component {

  state = {};

  editMode = !!this.props.personDocument

  componentWillMount(){
    //this.editMode = !!this.props.personDocument;
    // dynamic behavior
    emailRule(this.props.personForm);
    companyRule(this.props.personForm);

    const type = this.props.personForm.field('type');
    type.onValue( state => this.setState({isWorker: state.value === 'worker'}))
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

    const skills = () => {
      if(!this.state.isWorker) return <div/>
      return (
        <div className="col-md-12">
          <MultiSelectField field={person.field('skills')} allowCreate={true}/>
        </div>
      )
    }

    const roles = () => {
      //if(!this.state.isWorker) return <div/>
      return (
        <div className="col-md-12">
          <MultiSelectField field={person.field('roles')}/>
        </div>
      )
    }

    const note = () => {
      if(this.editMode)return <div/>;
      return (
        <div className="col-md-12">
          <MarkdownEditField field={person.field('note')}/>
        </div>
      )
    }

    const tags = () => {
      if(this.editMode)return <div/>;
      return (
        <div className="col-md-12">
          <TagsField field={person.field('tags')}/>
        </div>
      )
    }

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
                  <DropdownField field={person.field('prefix')}/>
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
                  <DropdownField field={person.field('type')}/>
                </div>
                <div className="col-md-6">
                  <InputField field={person.field('email')}/>
                </div>
                <div className="col-md-3">
                  <DropdownField field={person.field('jobType')}/>
                </div>
                <div className="col-md-12">
                  <DropdownField field={companyId}/>
                </div>
                <div className="col-md-12">
                  <PhonesField field={person.field('phones')} />
                </div>
                {tags()}
                {skills()}
                {roles()}
                <AvatarChooser person={person}/>
                <div className="col-md-12">
                  <MarkdownEditField field={person.field('jobDescription')}/>
                </div>
                {note()}
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
      email.setSchemaValue('required', true);
    }else{
      email.setSchemaValue('required', false);
    }
  });
}

function  companiesDomain(companies){
  if(!companies) return [];
  const values = _.chain(companies.toJS())
    .map(company => { return {key: company._id, value: company.name} })
    .sortBy(x => x.value)
    .value();
  values.unshift({key: undefined, value: '<No Company>'});
  return values;
}



