import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import {Header, HeaderLeft, HeaderRight, GoBack, Title, AvatarView, TextLabel, Labels, MarkdownText} from '../widgets';
import {TagsField} from '../fields';
import {Edit, Preferred, Delete} from './widgets';
import {Edit as EditMission, Preview as MissionPreview, Closed as ClosedMission} from '../mission/widgets';
import {Content } from '../layout';
import {personsStore, personsActions} from '../../models/persons';
import {missionsStore, missionsActions} from '../../models/missions';
import {navStore, navActions} from '../../models/nav';
import {companiesStore,  companiesActions} from '../../models/companies';
import sitemap from '../../routes';
import Notes from '../notes';
import tagsForm from '../../forms/tags';

export default class ViewPersonApp extends Component {
  state = {};

  componentWillMount() {
    let personId = this.props.location.state && this.props.location.state.personId;
    if(!personId) navActions.replace(sitemap.person.list);

    this.unsubscribeCompanies = companiesStore.listen( companies => {
      const company = companies.data.get(this.state.person.get('companyId'));
      this.setState({company, companies: companies.data});
    });

    this.unsubscribeNav = navStore.listen( state => {
      const newPersonId = state.context && state.context.personId;
      if(newPersonId && personId != newPersonId) {
        personId = newPersonId;
        personsActions.load({ids: [personId]});
      }
    });

    this.unsubscribePersons = personsStore.listen( persons => {
      const person = persons.data.get(personId);
      if(person){
        if(!this.tagsField){
          this.tagsField = tagsForm({tags: person.get('tags')}).field('tags');
          this.unsubscribeTags = this.tagsField.onValue( state => {
            if(state.hasBeenModified) personsActions.updateTags(person, state.value)
          });
        }

        if(person != this.state.person){
          // if(this.state.person && !_.isEqual(person.get('tags').toJS(), this.state.person.get('tags').toJS())){
          //   console.log("TAGS ARE DIFFERENT")
          // }
          this.setState({person, persons: persons.data});
        }

        if(this.unsubscribeMissions)this.unsubscribeMissions();
        this.unsubscribeMissions = missionsStore.listen( state => {
          const missions = state.data.filter(mission =>{
            return mission.get('managerId') === personId || mission.get('workerIds').toJS().indexOf(personId) !== -1;
          });
          this.setState({ missions })
        });

        companiesActions.load({ids: [person.get('companyId')]});
        missionsActions.load();
      }else{
        navActions.replace(sitemap.person.list);
      }
    });

    if(personId){
      personsActions.load({ids: [personId]});
    }else{
      navActions.replace(sitemap.person.list);
    }
  }

  componentWillUnmount(){
    if(this.unsubscribeMissions) this.unsubscribeMissions();
    if(this.unsubscribeCompanies) this.unsubscribeCompanies();
    if(this.unsubscribePersons) this.unsubscribePersons();
    if(this.unsubscribeTags) this.unsubscribeTags();
    if(this.unsubscribeNav) this.unsubscribeNav();
  }

  goBack = () => {
    navActions.goBack();
  }

  render(){
    if(!this.state.person) return false;
    const person = this.state.person;
    return (
      <Content>
        <Header obj={person}>
          <HeaderLeft>
            <GoBack goBack={this.goBack}/>
            <AvatarView obj={person}/>
            <Title title={person.get('name')}/>
            <Preferred person={person} active={true}/>
          </HeaderLeft>
          <HeaderRight>
            <Edit person={person}/>
            <Delete person={person} postAction={this.goBack}/>
          </HeaderRight>
        </Header>

        <Card 
          person={this.state.person} 
          missions={this.state.missions} 
          company={this.state.company} 
          persons={this.state.persons} 
          tags={this.tagsField} 
          companies={this.state.companies}/>
      </Content>
    )
  }
}

const Card = ({person, company, companies, persons, missions, tags}) =>  {
  const styles={
    container:{
      marginTop: '3rem',
    },
  }

  const handleClick = (e) => {
    e.preventDefault();
    navActions.push(sitemap.company.view, {companyId: company.get('_id')});
  }

  // const handleClickTag = (tag) => {
  //   navActions.push(sitemap.person.list, {filter: `#${tag} `});
  // }

  const phones = () =>  _.map(person.get('phones') && person.get('phones').toJS() || [], p => {
    return (
      <div key={p.label+p.number} className="col-md-4">
        <TextLabel label={`Phone: ${p.label}`} value={p.number}/>
      </div>
    )
  });

  const birthdate = () => {
    const date = person.get('birthdate') ? moment(person.get('birthdate')).format('DD/MM/YY') : "";
    return (
      <div className="col-md-2">
        <TextLabel label="Birth Date" value={date}/>
      </div>
    )
  }

  const companyElement = () => {
    if(!company) return <div/>
    return (
      <div className="col-md-12">
        <TextLabel 
          label="Company" 
          onClick={handleClick}
          value={company && company.get('name')}/>
      </div>
    )
  }  

  const jobDescription = () => {
    if(!person.get('jobDescription')) return <div/>
    return (
      <div className="col-md-12">
        <MarkdownText label="Job Description" value={person.get('jobDescription')}/>
      </div>
    )
  }


  const skills = () => {
    if(!person.get('skills') || !person.get('skills').size) return <div/>
    return (
      <div className="col-md-12">
        <Labels label="Skills" value={person.get('skills')}/>
      </div>
    )
  }

  const editTags = () => {
    return (
      <div className="col-md-12">
        <TagsField field={tags}/>
      </div>
    )
  }

  const roles = () => {
    if(!person.get('roles') || !person.get('roles').size) return <div/>
    return (
      <div className="col-md-12">
        <Labels label="Roles" value={person.get('roles')}/>
      </div>
    )
  }

  const type = () => {
    return (
        <div className="col-md-3">
          <TextLabel label="Type" value={person.get('type')}/>
        </div>
    )
  }

  const jobType = () => {
    return (
      <div className="col-md-3">
        <TextLabel label="Job Type" value={person.get('jobType')}/>
      </div>
    )
  }

  const email = () => {
    return (
        <div className="col-md-6">
          <TextLabel label="Email" value={person.get('email')}/>
        </div>
    )
  }

  return (
    <div>
      <div style={styles.container} className="row" >
        <div className="col-md-1">
          <TextLabel label="Prefix" value={person.get('prefix')}/>
        </div>
        <div className="col-md-5">
          <TextLabel label="First Name" value={person.get('firstName')}/>
        </div>
        <div className="col-md-6">
          <TextLabel label="Last Name" value={person.get('lastName')}/>
        </div>
        {companyElement()}
      </div>
      <div className="row" >
        {type()}
        {jobType()}
        {email()}
      </div>
      <div className="row">
        {phones()} 
      </div>
      <div className="row">
        {skills()} 
        {roles()} 
      </div>
      <div className="row">
        {jobDescription()}
      </div>
      <div className="row">
        <div className="col-md-12">
          <Missions 
            label="Missions" 
            companies={companies}
            persons={persons}
            missions={missions}/>
        </div>
      </div>
      <div className="row">
        {editTags()}
      </div>
      <div className="row">
        <div className="col-md-12">
          <Notes entity={person}/>
        </div>
      </div>

    </div>
  )
}

const Missions = ({label, missions, companies, persons}) => {

  if(!missions || !missions.size) return <div/>;

  const styles={
    container:{
      //marginBottom: '50px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    item:{
      height: '80px',
    }
  };

  const data = missions.sort( (a,b) => b.get('startDate') > a.get('startDate') ).map(mission =>{
    const company = companies.get(mission.get('clientId'));
    const workers = persons ? persons.filter(person => mission.get('workerIds').indexOf(person.get('_id')) !== -1) : null;
    return (
      <div key={mission.get('_id')} className="col-md-6 tm list-item" style={styles.item}> 
        <MissionPreview 
          mission={mission} 
          manager={persons.get(mission.get('managerId'))}
          workers={workers}
          company={company}>
          <EditMission mission={mission}/>
          <ClosedMission mission={mission}/>
        </MissionPreview>
      </div>
      )
    }).toSetSeq();

  return (
    <fieldset className="form-group">
      <label> {label} </label>
      <div className="row" style={styles.container}>
        {data}
      </div>
    </fieldset>
  )
}


