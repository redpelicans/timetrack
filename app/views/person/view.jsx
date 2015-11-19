import _ from 'lodash';
import moment from 'moment';
import Remarkable from 'remarkable';
import React, {Component} from 'react';
import routes from '../../routes';
import classNames from 'classnames';
import {Header, HeaderLeft, HeaderRight, GoBack, Title, AvatarView, Edit, Preferred, Delete, TextLabel, MarkdownText} from '../widgets';
import {timeLabels} from '../helpers';
import {Content } from '../layout';
import {personsStore,  personsActions} from '../../models/persons';
import {companiesStore,  companiesActions} from '../../models/companies';

export default class ViewPersonApp extends Component {
  state = {};

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    const personId = this.props.location.state.id;

    this.unsubcribeCompanies = companiesStore.listen( companies => {
      const company = companies.data.get(this.state.person.get('companyId'));
      //this.setState({companies: companies.data});
      this.setState({company: company});
    });

    this.unsubcribePersons = personsStore.listen( persons => {
      const person = persons.data.get(personId);
      if(person) {
        this.setState({person: person}, () => {
          companiesActions.load({ids: [person.get('companyId')]});
        })
      }
    });

    personsActions.load({ids: [personId]});
  }

  componentWillUnmount(){
    this.unsubcribePersons();
    this.unsubcribeCompanies();
  }

  goBack = () => {
    this.props.history.goBack();
  }

  handleEdit= (person) => {
    this.props.history.pushState({id: person.get('_id')}, routes.editperson.path);
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
            <GoBack history={this.props.history}/>
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
          company={this.state.company} 
          history={this.props.history}/>

      </Content>
    )
  }
}

const Card = ({person, history, company}) =>  {
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

  const companyElement = () => {
    if(!company) return <div/>
    return (
      <div className="col-md-12">
        <TextLabel 
          label="Company" 
          url={history.createHref("/company/view?id=" + company.get('_id')) } 
          value={company && company.get('name')}/>
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
        <TextLabel label="FirstName" value={person.get('firstName')}/>
      </div>
      <div className="col-md-5">
        <TextLabel label="LastName" value={person.get('lastName')}/>
      </div>
      <div className="col-md-2">
        <TextLabel label="BirthDate" value={birthdate}/>
      </div>
      {companyElement()}
    </div>
    <div className="row">
      {phones} 
    </div>
    <div className="row" >
      <div className="col-md-4">
        <TextLabel label="JobTitle" value={person.get('jobTitle')}/>
      </div>
      <div className="col-md-4">
        <TextLabel label="JobArea" value={person.get('jobArea')}/>
      </div>
      <div className="col-md-4">
        <TextLabel label="JobType" value={person.get('jobType')}/>
      </div>

      <div className="col-md-12">
        <TextLabel label="JobDescription" value={person.get('jobDescription')}/>
      </div>

      <div className="col-md-12">
        <MarkdownText label="Note" value={person.get('note')}/>
      </div>
    </div>
    </div>
  )
}

