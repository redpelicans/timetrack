import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import { routeActions } from 'react-router-redux'
import { connect } from 'react-redux';
import {viewCompanySelector} from '../../selectors/companies';
import {authable} from '../../components/authmanager';
import {companiesActions} from '../../actions/companies';
import {personsActions} from '../../actions/persons';
import {missionsActions} from '../../actions/missions';
import {Header, HeaderLeft, HeaderRight, GoBack, Title, AvatarView, TextLabel, Labels, MarkdownText} from '../../components/widgets';
import {Edit as EditPerson, Delete as DeletePerson, Preview as PersonPreview} from '../../components/person/widgets';
import TagsField from '../../containers/tags';
import Notes from '../../containers/notes';
import {Edit as EditMission, Preview as MissionPreview, Closed as ClosedMission} from '../../components/mission/widgets';
import {Edit, Preferred, Delete} from '../../components/company/widgets';
import {Content} from '../../components/layout';
import tagsForm from '../../forms/tags';
import sitemap from '../../routes';

class CompanyView extends Component {
  state = {};

  componentWillMount() {
    const {dispatch, company} = this.props;
    if(!company) dispatch(routeActions.replace(sitemap.company.list));

    this.tagsField = tagsForm({tags: company.get('tags')}).field('tags');
    this.unsubscribeTagsField = this.tagsField.onValue( state => {
      if(state.hasBeenModified) dispatch(companiesActions.updateTags(company, state.value));
    });

    dispatch(personsActions.load());
    dispatch(missionsActions.load());
  }

  componentWillUnmount(){
    if(this.unsubscribeTagsField) this.unsubscribeTagsField();
  }

  goBack = () => {
    this.props.dispatch(routeActions.goBack());
  }

  // handleClickTag = (tag) => {
  //   this.props.dispatch(routeActions.push(sitemap.company.list, {filter: `#${tag} `}));
  // }

  render(){
    const {company, persons, missions} = this.props;
    if( !company || !persons) return false;
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
          company={company} 
          missions={missions} 
          tagsField={this.tagsField} 
          persons={persons}/>
      </Content>
    )
  }
}

CompanyView.propTypes = {
  company: PropTypes.object,
  persons: PropTypes.object,
  missions: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

const Card = ({company, persons, missions, tagsField}) =>  {
  const styles={
    container:{
      marginTop: '3rem',
    },
  }

  const editTags = () => {
    return (
      <div className="col-md-12">
        <TagsField field={tagsField}/>
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
        {editTags()}
      <div className="col-md-12">
      <Notes entity={company}/>
      </div>
    </div>
  )
}

Card.PropTypes = {
  company: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
  missions: PropTypes.object.isRequired,
  tagsField: PropTypes.object.isRequired,
}

const Missions = ({label, missions, company, persons}) => {
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

Missions.propTypes = {
  label: PropTypes.string.isRequired,
  company: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
  missions: PropTypes.object.isRequired,
}


const Persons = ({label, company, persons}) => {
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

  const ids = company.get('personIds').toJS();
  const data = _.chain(ids)
    .map(id => persons.get(id))
    .compact()
    .sortBy( person => person.get('name') )
    .map( person => {
      return (
        <div key={person.get('_id')} className="col-md-6 tm list-item" style={styles.item}> 
          <PersonPreview person={person}>
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

Persons.propTypes = {
  label: PropTypes.string.isRequired,
  company: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
}

export const LeaveCompany = authable(({company, person}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    const answer = confirm(`Can you confirm you want to fire "${person.get('name')}"`);
    if(answer){
      dispatch(companiesActions.leave(company, person));
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
})

LeaveCompany.propTypes = {
  company: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
}

export const AddPerson =authable(({company}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    dispatch(routeActions.push(sitemap.person.new, {companyId: company.get('_id')}));
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
})

AddPerson.propTypes = {
  company: PropTypes.object.isRequired,
}

export const AddMission =authable(({company}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    dispatch(routeActions.push(sitemap.mission.new, {clientId: company.get('_id')}));
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
})

AddMission.propTypes = {
  company: PropTypes.object.isRequired,
}

export default connect(viewCompanySelector)(CompanyView);
