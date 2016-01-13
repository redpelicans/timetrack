import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import {Header, HeaderLeft, HeaderRight, GoBack, Title, AvatarView, TextLabel, Labels, MarkdownText} from '../widgets';
import {Edit, Preferred, Delete} from './widgets';
import {Edit as EditMission, Preview as MissionPreview, Closed as ClosedMission} from '../mission/widgets';
import {Content } from '../layout';
import {personsStore, personsActions} from '../../models/persons';
import {missionsStore, missionsActions} from '../../models/missions';
import {navStore, navActions} from '../../models/nav';
import {companiesStore,  companiesActions} from '../../models/companies';
import sitemap from '../../routes';

export default class ViewPersonApp extends Component {
  state = {};

  componentWillMount() {
    let personId = this.props.location.state.personId;

    this.unsubcribeCompanies = companiesStore.listen( companies => {
      const company = companies.data.get(this.state.person.get('companyId'));
      this.setState({company, companies: companies.data});
    });

    this.unsubcribeNav = navStore.listen( state => {
      const newPersonId = state.context && state.context.personId;
      if(newPersonId && personId != newPersonId) {
        personId = newPersonId;
        personsActions.load({ids: [personId]});
      }
    });

    this.unsubcribePersons = personsStore.listen( persons => {
      const person = persons.data.get(personId);
      if(person){
       if(person != this.state.person)this.setState({person});

        this.unsubcribeMissions = missionsStore.listen( state => {
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
    if(this.unsubcribeCompanies) this.unsubcribeCompanies();
    if(this.unsubcribePersons) this.unsubcribePersons();
    if(this.unsubcribeNav) this.unsubcribeNav();
    if(this.unsubcribeMissions) this.unsubcribeMissions();
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
          companies={this.state.companies}/>
      </Content>
    )
  }
}

const Card = ({person, company, companies, missions}) =>  {
  const styles={
    container:{
      marginTop: '3rem',
    },
  }

  const handleClick = (e) => {
    e.preventDefault();
    navActions.push(sitemap.company.view, {companyId: company.get('_id')});
  }

  const phones = () =>  _.map(person.get('phones') && person.get('phones').toJS() || [], p => {
    return (
      <div key={p.phone+p.label} className="col-md-4">
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

  const note = () => {
    if(!person.get('note')) return <div/>
    return (
      <div className="col-md-12">
        <MarkdownText label="Note" value={person.get('note')}/>
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

  const tags = () => {
    const onClick = (tag) => {
      navActions.push(sitemap.person.list, {filter: `#${tag} `});
    }

    if(!person.get('tags') || !person.get('tags').size) return <div/>
    return (
      <div className="col-md-12">
        <Labels label="Tags" value={person.get('tags')} onClick={onClick}/>
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
        {tags()}
      </div>
      <div className="row">
        {jobDescription()}
        {note()}
      </div>
      <div className="row">
        <div className="col-md-12">
          <Missions 
            label="Missions" 
            companies={companies}
            missions={missions}/>
        </div>
      </div>

    </div>
  )
}

const Missions = ({label, missions, companies}) => {

  if(!missions || !missions.size) return <div/>;

  const styles={
    container:{
      marginBottom: '50px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    item:{
      height: '80px',
    }
  };

  const data = missions.sort( (a,b) => b.get('startDate') > a.get('startDate') ).map(mission =>{
    const company = companies.get(mission.get('clientId'));
    return (
      <div key={mission.get('_id')} className="col-md-6 tm list-item" style={styles.item}> 
        <MissionPreview mission={mission} company={company}>
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


