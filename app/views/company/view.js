import _ from 'lodash';
import moment from 'moment';
import Remarkable from 'remarkable';
import React, {Component} from 'react';
import routes from '../../routes';
import classNames from 'classnames';
import {Header, HeaderLeft, HeaderRight, GoBack, Title, PersonPreview, AvatarView, LeaveCompany, AddPerson, Edit, Preferred, Delete, TextLabel, MarkdownText} from '../widgets';
import {Content} from '../layout';
import {Delete as DeleteCompany} from './widgets';
import {companiesStore, companiesActions} from '../../models/companies';
import {personsStore, personsActions} from '../../models/persons';

export default class ViewCompanyApp extends Component {
  state = {};

  // static contextTypes = {
  //   history: React.PropTypes.object.isRequired,
  // }

  componentWillMount() {
    const companyId = this.props.location.query.id || this.props.location.state.id;
    companiesActions.load({ids: [companyId]});

    this.unsubcribeCompanies = companiesStore.listen( companies => {
      const company = companies.data.get(companyId);
      this.setState({ company: companies.data.get(companyId) });
      if(company) personsActions.load({ids: company.personsIds});
    });

    this.unsubcribePersons = personsStore.listen( persons => {
      this.setState({ persons: persons.data })
    });
  }

  componentWillUnmount(){
    this.unsubcribeCompanies();
    this.unsubcribePersons();
  }

  goBack = () => {
    this.props.history.goBack();
  }

  handleEdit= (company) => {
    this.props.history.pushState({id: company.get('_id')}, routes.editcompany.path);
  }

  handleDelete = (company) => {
    let answer = confirm(`Are you sure to delete the company "${company.get('name')}"`);
    if(answer){
      companiesActions.delete(company.toJS());
      this.goBack();
    }
  }

  handleTogglePreferredPerson = (person) => {
    personsActions.togglePreferred(person);
  }

  handleEditPerson = (person) => {
    this.props.history.pushState({id: person.get('_id')}, routes.editperson.path);
  }

  handleViewPerson = (person) => {
    this.props.history.pushState({id: person.get('_id')}, routes.viewperson.path);
  }

  handleDeletePerson = (person) => {
    const answer = confirm(`Are you sure to delete the contact "${person.get('name')}"`);
    if(answer){
      personsActions.delete(person.toJS());
    }
  }

  handleAddPerson = (company) => {
    this.props.history.pushState({companyId: company.get('_id')}, routes.newperson.path);
  }

  handleLeaveCompany = (company, person) => {
    const answer = confirm(`Can you confirm you want to fire "${person.get('name')}"`);
    if(answer){
      companiesActions.leave(company, person);
    }
  }

  render(){
    if( !this.state.company || !this.state.persons) return false;
    const company = this.state.company;
    return (
      <Content>
        <Header obj={company}>
          <HeaderLeft>
            <GoBack history={this.props.history}/>
            <AvatarView obj={company}/>
            <Title title={company.get('name')}/>
            <Preferred obj={company}/>
          </HeaderLeft>
          <HeaderRight>
            <AddPerson onAdd={this.handleAddPerson.bind(null, company)}/>
            <Edit onEdit={this.handleEdit.bind(null, company)}/>
            <DeleteCompany company={company} onDelete={this.handleDelete.bind(null, company)}/>
          </HeaderRight>
        </Header>
        <Card 
          company={this.state.company} 
          persons={this.state.persons} 
          onViewPerson={this.handleViewPerson}
          onTogglePreferredPerson={this.handleTogglePreferredPerson}
          onEditPerson={this.handleEditPerson}
          onLeaveCompany={this.handleLeaveCompany.bind(null, this.state.company)}
          onDeletePerson={this.handleDeletePerson}/>
      </Content>
    )
  }
}

const Card = ({company, persons, onViewPerson, onLeaveCompany, onTogglePreferredPerson, onEditPerson, onDeletePerson}) =>  {
  const styles={
    container:{
      marginTop: '3rem',
    },
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
        <MarkdownText label="Note" value={company.get('note')}/>
      </div>
      <div className="col-md-12">
        <Persons 
          label="Contacts" 
          persons={persons} 
          company={company}
          onView={onViewPerson} 
          onTogglePreferred={onTogglePreferredPerson}
          onEdit={onEditPerson}
          onLeaveCompany={onLeaveCompany}
          onDelete={onDeletePerson}/>
      </div>
    </div>
  )
}

const Persons = ({label, company, persons, onView, onLeaveCompany, onTogglePreferred, onEdit, onDelete}) => {
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
          <PersonPreview person={person} onViewPerson={onView}>
            <Preferred obj={person} onTogglePreferred={onTogglePreferred}/>
            <LeaveCompany onLeaveCompany={onLeaveCompany.bind(null, person)}/>
            <Edit onEdit={onEdit.bind(null, person)}/>
            <Delete onDelete={onDelete.bind(null, person)}/>
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
