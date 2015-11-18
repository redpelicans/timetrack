import _ from 'lodash';
import moment from 'moment';
import Remarkable from 'remarkable';
import React, {Component} from 'react';
import routes from '../../routes';
import classNames from 'classnames';
import {PersonPreview, AvatarView, AddPerson, Edit, Preferred, TextLabel, MarkdownText} from '../widgets';
import {timeLabels} from '../helpers';
import {Content} from '../layout';
import {Delete} from './widgets';
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

  render(){
    if( !this.state.company || !this.state.persons) return false;
    return (
      <Content>
        <Header 
          company={this.state.company} 
          goBack={this.goBack} 
          onEdit={this.handleEdit} 
          onAddPerson={this.handleAddPerson} 
          onDelete={this.handleDelete}/>
        <Card 
          company={this.state.company} 
          persons={this.state.persons} 
          onViewPerson={this.handleViewPerson}
          onTogglePreferredPerson={this.handleTogglePreferredPerson}
          onEditPerson={this.handleEditPerson}
          onDeletePerson={this.handleDeletePerson}/>
      </Content>
    )
  }
}

const Card = ({company, persons, onViewPerson, onTogglePreferredPerson, onEditPerson, onDeletePerson}) =>  {
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
          onDelete={onDeletePerson}/>
      </div>
    </div>
  )
}

const Persons = ({label, company, persons, onView, onTogglePreferred, onEdit, onDelete}) => {
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
  const data = _.chain(ids).map(id => persons.get(id)).compact().map( person => {
    return (
      <div key={person.get('_id')} className="col-md-6 tm list-item" style={styles.item}> 
        <PersonPreview
          person={person} 
          onView={onView} 
          onTogglePreferred={onTogglePreferred} 
          onEdit={onEdit} 
          onDelete={onDelete}/>
      </div>
      )
    }).value();

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

const Header = ({company, goBack, onEdit, onDelete, onAddPerson}) => {
  const avatar = <AvatarView obj={company.toJS()}/>;
  const styles={
    container:{
      paddingTop: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    left:{
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      minWidth: '500px',
    },
    right:{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1,
    },
    name:{
      flexShrink: 0,
    },
    perferred:{
      color: company.get('preferred') ? '#00BCD4' : 'grey',
    },
    time: {
      fontSize: '.7rem',
      fontStyle: 'italic',
      display: 'block',
      float: 'right',
    },
  }

  const handleClick = (e) => {
    e.preventDefault();
    goBack();
  }

  return (
    <div>
      <div style={styles.container} className="tm title">
        <div style={styles.left}>
          <div>
            <a href="#" className="fa fa-arrow-left m-r" onClick={handleClick}/>
          </div>
          <div className="m-r">
            {avatar}
          </div>
          <div style={styles.name} className="m-r">
            {company.get('name')}
          </div>
          <Preferred obj={company}/>
        </div>
        <div style={styles.right}>
          <AddPerson company={company} onAdd={onAddPerson}/>
          <Edit obj={company} onEdit={onEdit}/>
          <Delete company={company} onDelete={onDelete}/>
        </div>
      </div>
      <hr/>
      <div style={styles.time} >
        {timeLabels(company.toJS())}
      </div>
    </div>
  )
}
