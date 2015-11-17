import _ from 'lodash';
import moment from 'moment';
import Remarkable from 'remarkable';
import React, {Component} from 'react';
import routes from '../../routes';
import classNames from 'classnames';
import {AvatarView, TextLabel, MarkdownText} from '../widgets';
import {timeLabels} from '../helpers';
import {Content } from '../layout';
import {personsStore as peopleStore, personsActions as peopleActions} from '../../models/persons';

export default class ViewPersonApp extends Component {
  state = {};

  static contextTypes = {
    history: React.PropTypes.object.isRequired,
  }

  componentWillMount() {
    const personId = this.props.location.state.id;
    peopleActions.loadMany([personId], {include: ['company']});
    this.unsubcribe = peopleStore.listen( state => {
      const person = peopleStore.getById(personId);
      console.log(person.toJS())
      this.setState({person: person});
    });

  }

  componentWillUnmount(){
    this.unsubcribe();
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
      peopleActions.delete(person);
      this.goBack();
    }
  }

  render(){
    if(!this.state.person) return false;
    return (
      <Content>
        <Header person={this.state.person} goBack={this.goBack} onEdit={this.handleEdit} onDelete={this.handleDelete}/>
        <Card person={this.state.person} history={this.props.history}/>
      </Content>
    )
  }
}

const Card = ({person, history}) =>  {
  const styles={
    container:{
      marginTop: '3rem',
    },
  }

  const phones = _.map(person.get('phones') && person.get('phones').toJS() || [], p => {
    return (
      <div key={p.label} className="col-md-4">
        <TextLabel label={`Phone: ${p.label}`} value={p.phone}/>
      </div>
    )
  });

  const birthdate = person.get('birthdate') ? moment(person.get('birthdate')).format('DD/MM/YY') : "";
  const company = person.get('company');
  const companyUrl = company ? history.createHref("/company/view?id=" + company.get('_id')) : '';
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
      <div className="col-md-12">
        <TextLabel label="Company" url={companyUrl} value={person.getIn(['company', 'name'])}/>
      </div>
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

const Phones = ({person}) => {
  return render.length ? render : <div/>;
}

const Header = ({person, goBack, onEdit, onDelete}) => {
  const avatar = <AvatarView obj={person.toJS()}/>;
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
      color: person.get('preferred') ? '#00BCD4' : 'grey',
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
            {person.get('name')}
          </div>
          <div>
            <i style={styles.perferred} className="fa fa-star-o m-r"/>
          </div>
        </div>
        <div style={styles.right}>
          <Edit person={person} onEdit={onEdit}/>
          <Delete person={person} onDelete={onDelete}/>
        </div>
      </div>
      <hr/>
      <div style={styles.time} >
        {timeLabels(person.toJS())}
      </div>
    </div>
  )
}

const Edit = ({person, onEdit}) => {
  const handleChange = (e) => {
    onEdit(person);
    e.preventDefault();
  }

  let style={
    fontSize: '1.2rem',
    color: 'grey',
  };

  return (
    <a href="#" onClick={handleChange}>
      <i style={style} className="iconButton fa fa-pencil m-r"/>
    </a>
  )
}

const Delete =({person, onDelete}) => {
  const handleChange = (e) => {
    onDelete(person);
    e.preventDefault();
  }

  let style={
    fontSize: '1.2rem',
    color: 'grey',
  };

  return (
    <a href="#" onClick={handleChange}>
      <i style={style} className="iconButton fa fa-trash m-r"/>
    </a>
  )
}


