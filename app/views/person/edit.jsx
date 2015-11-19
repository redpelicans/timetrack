import _ from 'lodash';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import { Lifecycle } from 'react-router';
import routes from '../../routes';
import Immutable from 'immutable';
import classNames from 'classnames';
import personForm, {colors, avatarTypes} from '../../forms/person';
import {personsStore,  personsActions} from '../../models/persons';
import {companiesStore,  companiesActions} from '../../models/companies';
import {Content} from '../layout';
import {Form, AddBtn, UpdateBtn, CancelBtn, ResetBtn, StarField, AvatarChooserField, AvatarViewField, MarkdownEditField, InputField, SelectField} from '../widgets';
import {Header, HeaderLeft, HeaderRight, GoBack, Title} from '../widgets';

@reactMixin.decorate(Lifecycle)
export class NewPersonApp extends Component {

  state = {
    forceLeave: false,
  }

  // static contextTypes = {
  //   history: React.PropTypes.object.isRequired,
  // }
  
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
      this.props.history.goBack();
    });
  }

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit();
    if(this.unsubscribeState) this.unsubscribeState();
    if(this.unsubscribeCompanies) this.unsubscribeCompanies();
  }

  componentWillMount() {
    let companyId = this.props.location.state && this.props.location.state.companyId;
    this.personForm =  companyId ? personForm({companyId: companyId}) : personForm();

    this.unsubscribeCompanies = companiesStore.listen( state => {
      this.setState({companies: state.data});
    });

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
  }

  render(){
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
          personForm={this.personForm}/>
      </div>
    )
  }
}


@reactMixin.decorate(Lifecycle)
export class EditPersonApp extends Component {

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
    this.personForm.submit();
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
    if(this.unsubscribePersons) this.unsubscribePersons();
    if(this.unsubscribeCompanies) this.unsubscribeCompanies();
  }

  componentWillMount() {
    let personId = this.props.location.state.id;

    this.unsubscribeCompanies = companiesStore.listen( companies => {
      this.setState({companies: companies.data});
    });

    this.unsubscribePersons = personsStore.listen( persons => {
      const person = persons.data.get(personId);
      if(person && !this.personDocument){
        this.personDocument = person.toJS();
        this.personForm = personForm(this.personDocument);

        this.unsubscribeSubmit = this.personForm.onSubmit( state => {
          console.log(this.personForm.toDocument(state))
          personsActions.update(this.personDocument, this.personForm.toDocument(state));
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

    personsActions.load({ids: [personId]});
    companiesActions.load();
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
          personForm={this.personForm}/>
      </div>
    )
  }
}

export default class EditContent extends Component {
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
    if(!this.props.personForm) return false;

    let styles = {
      time: {
        fontSize: '.7rem',
        fontStyle: 'italic',
        display: 'block',
        float: 'right',
      }
    }

    const fakePerson = Immutable.fromJS(_.pick(this.props.personDocument, 'createdAt', 'updatedAt'));
    const companyId = this.props.personForm.field('companyId');
    companyId.schema.domainValue = this.companiesValues();

    return (
      <Content>
        <div className="row">
          <div className="col-md-12">

            <Header obj={fakePerson}>
              <HeaderLeft>
                <GoBack goBack={this.props.goBack}/>
                <AvatarViewField type='person' obj={this.props.personForm}/>
                <Title title={this.props.title}/>
              </HeaderLeft>
              <HeaderRight>
                {this.props.submitBtn}
                {this.props.cancelBtn}
                <ResetBtn obj={this.props.personForm}/>
              </HeaderRight>
            </Header>

          </div>
          <div className="col-md-12 m-b"/>
          <div className="col-md-12">
            <Form>
              <div className="row">
                <div className="col-md-3">
                  <SelectField field={this.props.personForm.field('prefix')}/>
                </div>
                <div className="col-md-4">
                  <InputField field={this.props.personForm.field('firstName')}/>
                </div>
                <div className="col-md-4">
                  <InputField field={this.props.personForm.field('lastName')}/>
                </div>
                <div className="col-md-1">
                  <StarField field={this.props.personForm.field('preferred')}/>
                </div>
                <div className="col-md-12">
                  <SelectField field={companyId}/>
                </div>
                <div className="col-md-12">
                <AvatarChooserField field={this.props.personForm.field('avatar')}/>
                </div>
                <div className="col-md-12">
                  <MarkdownEditField field={this.props.personForm.field('note')}/>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Content>
    )
  }
}
