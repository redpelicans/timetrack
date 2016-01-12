import _ from 'lodash';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import { Lifecycle } from 'react-router';
import Immutable from 'immutable';
import missionForm from '../../forms/mission';
import {missionsStore,  missionsActions} from '../../models/missions';
import {loginStore} from '../../models/login';
import {navActions, navStore} from '../../models/nav';
import {companiesStore,  companiesActions} from '../../models/companies';
import {personsStore,  personsActions} from '../../models/persons';
import {Content} from '../layout';
import sitemap from '../../routes';
import {Form, AddBtn, UpdateBtn, CancelBtn, ResetBtn} from '../widgets';
import {AvatarView, Header, HeaderLeft, HeaderRight, GoBack, Title } from '../widgets';
import {PeriodField, MultiSelectField2, MarkdownEditField, InputField, DropdownField} from '../fields';

@reactMixin.decorate(Lifecycle)
export class NewMissionApp extends Component {

  state = {
    forceLeave: false,
  }

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  routerWillLeave = nextLocation => {
    if(!this.state.forceLeave && this.state.hasBeenModified) return "Are you sure you want to leave the page without saving new mission?";
    return true;
  }

  handleSubmit = () => {
    this.missionForm.submit();
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
    if(this.unsubscribePersons) this.unsubscribePersons();
  }

  componentWillMount() {
    let clientId = this.props.location.state && this.props.location.state.clientId;
    this.missionForm =  clientId ? missionForm({clientId}) : missionForm();

    this.unsubscribeCompanies = companiesStore.listen( companies => {
      const clientIdField = this.missionForm.field('clientId');
      clientIdField.setSchemaValue('domainValue', clientsDomain(companies.data));
      this.setState({companies: companies.data});
    });

    this.unsubscribePersons = personsStore.listen( persons => {
      const managerIdField = this.missionForm.field('managerId');
      managerIdField.setSchemaValue('domainValue', workersDomain(persons.data));

      const workerIdsField = this.missionForm.field('workerIds');
      workerIdsField.setSchemaValue('domainValue', workersDomain(persons.data));

      this.setState({persons: persons.data});
    });


    this.unsubscribeSubmit = this.missionForm.onSubmit( (state, mission) => {
      missionsActions.create(mission);
      this.goBack(true);
    });

    this.unsubscribeState = this.missionForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      });
    });

    companiesActions.load();
    personsActions.load();
  }

  render(){
    if(!this.state.companies)return false;
    let submitBtn = <AddBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit}/>;
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>;

    return (
      <div>
        <EditContent 
          title={"Add a Mission"} 
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          goBack={this.goBack}
          clients={this.state.companies}
          missionForm={this.missionForm}/>
      </div>
    )
  }
}

@reactMixin.decorate(Lifecycle)
export class EditMissionApp extends Component {

  state = {
    forceLeave: false,
  }

  routerWillLeave = nextLocation => {
    if(!this.state.forceLeave && this.state.hasBeenModified) return "Are you sure you want to leave the page without saving updates?";
    return true;
  }

  handleSubmit = () => {
    this.missionForm.submit();
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
    if(this.unsubscribeMissions) this.unsubscribeMissions();
    if(this.unsubscribeCompanies) this.unsubscribeCompanies();
    if(this.unsubscribePersons) this.unsubscribePersons();
  }

  componentWillMount() {
    let missionId = this.props.location.state && this.props.location.state.missionId;

    this.unsubscribeMissions = missionsStore.listen( missions => {
      const mission = missions.data.get(missionId);
      if(!mission) return navActions.replace(sitemap.mission.list);
      if(!this.missionDocument){
        this.missionDocument = mission.toJS();
        this.missionForm = missionForm(this.missionDocument);

        this.unsubscribeCompanies = companiesStore.listen( companies => {
          const clientIdField = this.missionForm.field('clientId');
          clientIdField.setSchemaValue('domainValue', clientsDomain(companies.data));
          this.setState({companies: companies.data});
        });

        this.unsubscribePersons = personsStore.listen( persons => {
          const managerIdField = this.missionForm.field('managerId');
          managerIdField.setSchemaValue('domainValue', workersDomain(persons.data));

          const workerIdsField = this.missionForm.field('workerIds');
          workerIdsField.setSchemaValue('domainValue', workersDomain(persons.data));

          this.setState({persons: persons.data});
        });

        this.unsubscribeSubmit = this.missionForm.onSubmit( (state, mission) => {
          missionsActions.update(this.missionDocument, mission);
          this.goBack(true);
        });

        this.unsubscribeState = this.missionForm.onValue( state => {
          this.setState({
            canSubmit: state.canSubmit,
            hasBeenModified: state.hasBeenModified,
          });
        });

        companiesActions.load();
        personsActions.load();
      }
    });

   if(missionId) missionsActions.load({ids: [missionId]});
   else navActions.replace(sitemap.mission.list);
  }

  render(){
    if(!this.missionForm || !this.state.companies)return false;
    let submitBtn = <UpdateBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit && this.state.hasBeenModified}/>;
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>;

    return (
      <div>
        <EditContent 
          title={"Edit Mission"} 
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          goBack={this.goBack}
          clients={this.state.companies}
          missionDocument={this.missionDocument} 
          missionForm={this.missionForm}/>
      </div>
    )
  }
}


export default class EditContent extends Component {

  state = {};

  componentWillMount() {
    const clientIdField = this.props.missionForm.field('clientId');
    clientIdField.onValue( state => {
    const client = this.props.clients.get(state.value);
    this.setState({client});
    });
  }

  render(){
    if(!this.props.missionForm) return false;

    const fake = Immutable.fromJS(_.pick(this.props.missionDocument, 'createdAt', 'updatedAt'));
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
                <AvatarView obj={this.state.client}/>
                <Title title={this.props.title}/>
              </HeaderLeft>
              <HeaderRight>
                {this.props.submitBtn}
                {this.props.cancelBtn}
                <ResetBtn obj={this.props.missionForm}/>
              </HeaderRight>
            </Header>

          </div>
          <div className="col-md-12 m-b"/>
          <div className="col-md-12">
            <Form>
              <div className="row">

                <div className="col-md-6">
                  <DropdownField field={this.props.missionForm.field('clientId')}/>
                </div>

                <div className="col-md-6">
                  <DropdownField field={this.props.missionForm.field('managerId')}/>
                </div>

                <div className="col-md-8">
                  <InputField field={this.props.missionForm.field('name')}/>
                </div>

                <div className="col-md-4">
                  <PeriodField 
                    startDate={this.props.missionForm.field('startDate')}
                    endDate={this.props.missionForm.field('endDate')} />
                </div>

                <div className="col-md-12">
                  <MultiSelectField2 field={this.props.missionForm.field('workerIds')}/>
                </div>

                <div className="col-md-12">
                  <MarkdownEditField field={this.props.missionForm.field('note')}/>
                </div>

              </div>
            </Form>
          </div>
        </div>
      </Content>
    )
  }
}

function  clientsDomain(companies){
  if(!companies) return [];
  const values = _.chain(companies.toJS())
    .filter(company => company.type === 'client' || company.type === 'partner')
    .map(company => { return {key: company._id, value: company.name} })
    .sortBy(x => x.value)
    .value();
  return values;
}

function  workersDomain(persons){
  if(!persons) return [];
  const values = _.chain(persons.toJS())
    .filter(person => person.type === 'worker')
    .map(person => { return {key: person._id, value: person.name} })
    .sortBy(x => x.value)
    .value();
  return values;
}

