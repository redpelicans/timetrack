import _ from 'lodash';
import moment from 'moment';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux'
import {routeActions} from '../../actions/routes'
import {Header, HeaderLeft, HeaderRight, GoBack, Title, AvatarView, TextLabel, Labels, MarkdownText, IconButton} from '../../components/widgets';
import {Edit, Preferred, Delete} from '../../components/person/widgets';
import {Edit as EditMission, Preview as MissionPreview, Closed as ClosedMission} from '../../components/mission/widgets';
import {Content} from '../../components/layout';
import {viewPersonSelector} from '../../selectors/persons'
import {personsActions} from '../../actions/persons'
import {agendaActions} from '../../actions/agenda'
import {companiesActions} from '../../actions/companies'
import {missionsActions} from '../../actions/missions'
import sitemap from '../../routes';
import Notes from '../notes';
import TagsField from '../tags';
import tagsForm from '../../forms/tags';

class ViewPerson extends Component {

  componentWillMount() {
    const {person, dispatch} = this.props
    if (!person) dispatch(routeActions.replace(sitemap.person.list))

    this.tagsField = tagsForm({tags: person.get('tags')}).field('tags')
    this.unsubscribeTagsField = this.tagsField.onValue(state => {
      if (state.hasBeenModified) dispatch(personsActions.updateTags(person.toJS(), state.value))
    })

    dispatch(personsActions.load())
    dispatch(missionsActions.load())
    dispatch(companiesActions.load())
  }

  componentWillUnmount(){
    if(this.unsubscribeTagsField) this.unsubscribeTagsField()
  }

  goBack = () => {
    this.props.dispatch(routeActions.goBack())
  }

  handleClick = () => {
    this.props.dispatch(agendaActions.changeFilter({missionIds: [], workerIds: [this.props.person.get('_id')]}))
    this.props.dispatch(routeActions.push(sitemap.agenda.view))
  }

  render(){
    const {person, company, missions, companies, persons, isLoading, dispatch} = this.props
    if(!person) return false;

    const calendar = () => {
      if(person.get('type') !== 'worker') return <div/>
      return <div className="m-r-1"><IconButton name={'calendar'} label={'View Calendar'} onClick={this.handleClick}/></div>
    }

    return (
      <Content>
        <Header obj={person}>
          <HeaderLeft>
            <GoBack goBack={this.goBack} isLoading={isLoading}/>
            <AvatarView style={{paddingRight: '10px'}} obj={person}/>
            <Title title={person.get('name')}/>
            <Preferred person={person} active={true}/>
          </HeaderLeft>
          <HeaderRight>
            {calendar()}
            <Edit person={person}/>
            <Delete person={person} postAction={this.goBack}/>
          </HeaderRight>
        </Header>

        <Card
          person={person}
          missions={missions}
          company={company}
          persons={persons}
          tagsField={this.tagsField}
          companies={companies}
          dispatch={dispatch}
        />
      </Content>
    )
  }
}

ViewPerson.PropTypes = {
  dispatch:     PropTypes.func.isRequired,
  person:       PropTypes.object,
  company:      PropTypes.object,
  missions:     PropTypes.object,
  companies:    PropTypes.object,
  persons:      PropTypes.object,
  isLoading:    PropTypes.bool
}

const Card = ({person, company, companies, persons, missions, tagsField, dispatch}) =>  {

  const styles={
    container:{
      marginTop: '3rem',
    },
  }

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(routeActions.push(sitemap.company.view, {companyId: company.get('_id')}))
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
        <TagsField field={tagsField}/>
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

Card.PropTypes = {
  dispatch:     PropTypes.func.isRequired,
  person:       PropTypes.object.isRequired,
  company:      PropTypes.object.isRequired,
  companies:    PropTypes.object.isRequired,
  persons:      PropTypes.object.isRequired,
  missions:     PropTypes.object.isRequired,
  tags:         PropTypes.object.isRequired
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

Missions.PropTypes = {
  label:      PropTypes.string,
  missions:   PropTypes.object.isRequired,
  companies:  PropTypes.object.isRequired,
  persons:    PropTypes.object.isRequired
}

export default connect (viewPersonSelector)(ViewPerson)
