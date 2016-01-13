import _ from 'lodash';
import React, {Component} from 'react';
import {Header, HeaderLeft, HeaderRight, GoBack, Title, AvatarView, TextLabel, Labels, MarkdownText} from '../widgets';
import {Edit as EditPerson, Preferred as PreferredPerson, Delete as DeletePerson, Preview as PersonPreview} from '../person/widgets';
import {Edit as EditMission, Preview as MissionPreview, Closed as ClosedMission} from '../mission/widgets';
import {Edit, Preferred, Delete} from './widgets';
import {Content} from '../layout';
import {companiesActions, companiesStore} from '../../models/companies';
import {personsStore, personsActions} from '../../models/persons';
import {missionsStore, missionsActions} from '../../models/missions';
import {navStore, navActions} from '../../models/nav';
import sitemap from '../../routes';
import authManager from '../../auths';

export default class ViewCompanyApp extends Component {
  state = {};

  componentWillMount() {
    let companyId = this.props.location.state && this.props.location.state.companyId;

    this.unsubcribePersons = personsStore.listen( persons => {
      this.setState({ persons: persons.data })
    });

    this.unsubcribeCompanies = companiesStore.listen( companies => {
      const company = companies.data.get(companyId);
      if(company){
        if(company != this.state.company) this.setState({company});

        this.unsubcribeMissions = missionsStore.listen( state => {
          const missions = state.data.filter(mission => mission.get('clientId') === companyId);
          this.setState({ missions })
        });

        personsActions.load({ids: company.personsIds});
        missionsActions.load();
      }else{
        navActions.replace(sitemap.company.list);
      }
    });

    if(companyId) companiesActions.load({ids: [companyId]});
    else navActions.replace(sitemap.company.list);

  }

  componentWillUnmount(){
    this.unsubcribeCompanies();
    this.unsubcribePersons();
    if(this.unsubcribeMissions) this.unsubcribeMissions();
  }

  goBack = () => {
    navActions.goBack();
  }

  render(){
    if( !this.state.company || !this.state.persons) return false;
    const company = this.state.company;
    return (
      <Content>
        <Header obj={company}>
          <HeaderLeft>
            <GoBack goBack={this.goBack}/>
            <AvatarView obj={company}/>
            <Title title={company.get('name')}/>
            <Preferred active={true} company={company}/>
          </HeaderLeft>
          <HeaderRight>
            <AddMission company={company}/>
            <AddPerson company={company}/>
            <Edit company={company}/>
            <Delete company={company} postAction={this.goBack}/>
          </HeaderRight>
        </Header>
        <Card 
          company={this.state.company} 
          missions={this.state.missions} 
          persons={this.state.persons}  />
      </Content>
    )
  }
}

const Card = ({company, persons, missions}) =>  {
  const onClick = (tag) => {
    navActions.push(sitemap.company.list, {filter: `#${tag} `});
  }

  const styles={
    container:{
      marginTop: '3rem',
    },
  }

  const tags = () => {
    if(!company.get('tags') || !company.get('tags').size) return <div/>
    return (
      <div className="col-md-12">
        <Labels label="Tags" value={company.get('tags')} onClick={onClick}/>
      </div>
    )
  }

  return (
    <div style={styles.container} className="row" >
      <div className="col-md-4 ">
        <TextLabel label="Type" value={company.get('type')}/>
      </div>
      <div className="col-md-8 ">
        <TextLabel url={company.get('website')} label="website" value={company.get('website')}/>
      </div>
      <div className="col-md-5">
        <TextLabel label="Street" value={company.getIn(['address', 'street'])}/>
      </div>
      <div className="col-md-2">
        <TextLabel label="Zip Code" value={company.getIn(['address', 'zipcode'])}/>
      </div>
      <div className="col-md-2">
        <TextLabel label="City" value={company.getIn(['address', 'city'])}/>
      </div>
      <div className="col-md-3">
        <TextLabel label="Country" value={company.getIn(['address', 'country'])}/>
      </div>
      {tags()}
      <div className="col-md-12">
        <MarkdownText label="Note" value={company.get('note')}/>
      </div>
      <div className="col-md-12">
        <Persons 
          label="Contacts" 
          persons={persons} 
          company={company}/>
      </div>
      <div className="col-md-12">
        <Missions 
          label="Missions" 
          persons={persons} 
          company={company}
          missions={missions}/>
      </div>
    </div>
  )
}

const Missions = ({label, missions, company, persons}) => {

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
      const workers = persons.filter(person => mission.get('workerIds').indexOf(person.get('_id')) !== -1);
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


const Persons = ({label, company, persons}) => {
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

  const ids = company.get('personIds').toJS();
  const data = _.chain(ids)
    .map(id => persons.get(id))
    .compact()
    .sortBy( person => person.get('name') )
    .map( person => {
      return (
        <div key={person.get('_id')} className="col-md-6 tm list-item" style={styles.item}> 
          <PersonPreview person={person}>
            <PreferredPerson active={true} person={person}/>
            <LeaveCompany company={company} person={person}/>
            <EditPerson person={person}/>
            <DeletePerson person={person}/>
          </PersonPreview>
        </div>
        )
      })
    .value();

  if(!data.length) return <div/>;

  return (
    <fieldset className="form-group">
      <label> {label} </label>
      <div className="row" style={styles.container}>
        {data}
      </div>
    </fieldset>
  )
}


export const LeaveCompany =({company, person}) => {
  const handleChange = (e) => {
    e.preventDefault();
    const answer = confirm(`Can you confirm you want to fire "${person.get('name')}"`);
    if(answer){
      companiesActions.leave(company, person);
    }
  }

  if(authManager.company.isAuthorized('leave')){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-sign-out m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-sign-out m-r-1"/>
  }
}

export const AddPerson =({company}) => {
  const handleChange = (e) => {
    e.preventDefault();
    navActions.push(sitemap.person.new, {companyId: company.get('_id')});
  }

  if(authManager.isAuthorized(sitemap.person.new)){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-user-plus m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-user-plus m-r-1"/>
  }
}

export const AddMission =({company}) => {
  const handleChange = (e) => {
    e.preventDefault();
    navActions.push(sitemap.mission.new, {clientId: company.get('_id')});
  }

  if(authManager.isAuthorized(sitemap.mission.new)){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-cart-plus m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-cart-plus m-r-1"/>
  }
}
