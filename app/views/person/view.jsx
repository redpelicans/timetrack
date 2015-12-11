import _ from 'lodash';
import moment from 'moment';
import Remarkable from 'remarkable';
import React, {Component} from 'react';
import classNames from 'classnames';
import {Header, HeaderLeft, HeaderRight, GoBack, Title, AvatarView, TextLabel, Labels, MarkdownText} from '../widgets';
import {Edit, Preferred, Delete} from './widgets';
import {timeLabels} from '../helpers';
import {Content } from '../layout';
import {personsStore, personsActions} from '../../models/persons';
import {navStore, navActions} from '../../models/nav';
import {companiesStore,  companiesActions} from '../../models/companies';
import sitemap from '../../routes';

export default class ViewPersonApp extends Component {
  state = {};

  componentWillMount() {

    this.unsubcribeCompanies = companiesStore.listen( companies => {
      const company = companies.data.get(this.state.person.get('companyId'));
      this.setState({company});
    });

    this.unsubcribePersons = personsStore.listen( persons => {
      const person = persons.data.get(this.state.person.get('_id'));
      if(person != this.state.person) this.setState({person});
    });

    const context = navStore.getContext();
    const person = context.person;
    if(!person) return navActions.replace(sitemap.person.list);
    this.setState({person}, () => {
      companiesActions.load({ids: [person.get('companyId')]});
    })

  }

  componentWillUnmount(){
    if(this.unsubcribeCompanies) this.unsubcribeCompanies();
    if(this.unsubcribePersons) this.unsubcribePersons();
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
            <Delete person={person}/>
          </HeaderRight>
        </Header>

        <Card 
          person={this.state.person} 
          company={this.state.company}/>
      </Content>
    )
  }
}

const Card = ({person, company}) =>  {
  const styles={
    container:{
      marginTop: '3rem',
    },
  }

  const handleClick = (e) => {
    e.preventDefault();
    navActions.push(sitemap.company.view, {company});
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
    if(!person.get('skills')) return <div/>
    return (
      <div className="col-md-12">
        <Labels label="Skills" value={person.get('skills')}/>
      </div>
    )
  }

  const roles = () => {
    if(!person.get('roles')) return <div/>
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
        <TextLabel label="Job Title" value={person.get('jobTitle')}/>
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
        <div className="col-md-4">
          <TextLabel label="First Name" value={person.get('firstName')}/>
        </div>
        <div className="col-md-5">
          <TextLabel label="Last Name" value={person.get('lastName')}/>
        </div>
        {birthdate}
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
        {note()}
      </div>
    </div>
  )
}

