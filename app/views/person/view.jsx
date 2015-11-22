import _ from 'lodash';
import moment from 'moment';
import Remarkable from 'remarkable';
import React, {Component} from 'react';
import routes from '../../sitemap';
import classNames from 'classnames';
import {Header, HeaderLeft, HeaderRight, GoBack, Title, AvatarView, Edit, Preferred, Delete, TextLabel, MarkdownText} from '../widgets';
import {timeLabels} from '../helpers';
import {Content } from '../layout';
import {personsActions} from '../../models/persons';
import {personStore,  personActions} from '../../models/person';
import {navActions} from '../../models/nav';
import {companiesStore,  companiesActions} from '../../models/companies';

export default class ViewPersonApp extends Component {
  state = {};

  componentWillMount() {

    this.unsubcribeCompanies = companiesStore.listen( companies => {
      const company = companies.data.get(this.state.person.get('companyId'));
      this.setState({company: company});
    });

    this.unsubcribePerson = personStore.listen( ctx => {
      const person = ctx.person;
      if(!person) return navActions.replace('people');
      this.setState({person}, () => {
        companiesActions.load({ids: [person.get('companyId')]});
      })
    });

    personActions.load();
  }

  componentWillUnmount(){
    if(this.unsubcribePerson) this.unsubcribePerson();
    if(this.unsubcribeCompanies) this.unsubcribeCompanies();
  }

  goBack = () => {
    navActions.goBack();
  }

  handleEdit= (person) => {
    personActions.edit({person});
  }

  handleDelete = (person) => {
    let answer = confirm(`Are you sure to delete the person "${person.get('name')}"`);
    if(answer){
      personsActions.delete(person.toJS());
      this.goBack();
    }
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
            <Preferred obj={person}/>
          </HeaderLeft>
          <HeaderRight>
            <Edit onEdit={this.handleEdit.bind(null, person)}/>
            <Delete obj={person} onDelete={this.handleDelete.bind(null, person)}/>
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

  const phones = _.map(person.get('phones') && person.get('phones').toJS() || [], p => {
    return (
      <div key={p.phone+p.label} className="col-md-4">
        <TextLabel label={`Phone: ${p.label}`} value={p.phone}/>
      </div>
    )
  });

  const birthdate = person.get('birthdate') ? moment(person.get('birthdate')).format('DD/MM/YY') : "";

  const handleClick = (e) => {
    e.preventDefault();
    companyAction.view({company});
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
        <div className="col-md-2">
          <TextLabel label="Birth Date" value={birthdate}/>
        </div>
        {companyElement()}
      </div>
      <div className="row">
        {phones} 
      </div>
      <div className="row" >
        <div className="col-md-6">
          <TextLabel label="Job Title" value={person.get('jobTitle')}/>
        </div>
        <div className="col-md-6">
          <TextLabel label="Email" value={person.get('email')}/>
        </div>
        {jobDescription}
        {note}
      </div>
    </div>
  )
}

