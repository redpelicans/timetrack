import React, {Component} from 'react';
import classNames from 'classnames';
import routes from '../../routes';
import {navActions} from '../../models/nav';
import {personsActions} from '../../models/persons';
import authManager from '../../auths';
import {AvatarView} from '../widgets';


export const Edit = ({person}) => {
  const handleChange = (e) => {
    e.preventDefault();
    navActions.push(routes.person.edit, {personId: person.get('_id')});
  }

  if(authManager.person.isAuthorized('edit')){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-pencil m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-pencil m-r-1"/>
  }
}


export const Delete =({person, postAction}) => {
  const handleChange = (e) => {
    e.preventDefault();
    const answer = confirm(`Are you sure to delete the contact "${person.get('name')}"`);
    if(answer){
      personsActions.delete(person.toJS());
      if(postAction) postAction();
    }
  }

  if(authManager.person.isAuthorized('delete')){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-trash m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-trash m-r-1"/>
  }
}


export const Preferred = ({person, active}) => {
  const handleChange = (e) => {
    e.preventDefault();
    personsActions.togglePreferred(person);
  }

  const classnames = classNames("iconButton star fa fa-star-o m-r-1", {
    preferred: person.get('preferred'),
  });

  if(active && authManager.person.isAuthorized('togglePreferred')){
    return (
      <a href="#" onClick={handleChange}>
        <i className={classnames}/>
      </a>
    )
  }else{
    return (
      <i className={classnames}/>
    )
  }
}


export class AddButton extends Component {
  componentDidMount(){
    $('#addObject').tooltip({animation: true});
  }

  handleClick = () => {
    $('#addObject').tooltip('hide');
    navActions.push(routes.person.new);
  }

  render(){
    const style = {
        position: 'fixed',
        display: 'block',
        right: 0,
        bottom: 0,
        marginRight: '30px',
        marginBottom: '30px',
        zIndex: '900',
    }

    if(!authManager.person.isAuthorized('add')){
      return <div/>
    } else {
      return (
        <button id="addObject" type="button" className="btn-primary btn"  data-toggle="tooltip" data-placement="left" title={this.props.title} style={style}  onClick={this.handleClick}>
          <i className="fa fa-plus"/>
        </button>
      )
    }
  }
}


export class Preview extends Component {
  shouldComponentUpdate(nextProps, nextState){
    return this.props.person !== nextProps.person || this.props.company !== nextProps.company;
  }

  handleViewPerson = (e) => {
    e.preventDefault();
    navActions.push(routes.person.view, {personId: this.props.person.get('_id')});
  }

  handleViewCompany = (e) => {
    e.preventDefault();
    navActions.push(routes.company.view, {companyId: this.props.company.get('_id')});
  }

  render() {
    console.log("render Person")
    function phone(person){
      if(!person.phones || !person.phones.length) return '';
      const {label, phone} = person.phones[0];
      return `tel. ${label}: ${phone}`;
    }
    
    const companyView = () => {
      const company = this.props.company;
      if(!company) return '';
      return <div style={styles.company} className="p-r-1"> <a href="#" onClick={this.handleViewCompany}>{company.get('name')}</a> </div> ;
    }

    const styles = {
      container:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
      },
      containerLeft:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        padding: '5px',
      },
      containerRight:{
        display: 'flex',
        justifyContent: 'right',
        alignItems: 'center',
        padding: '5px',
      },
      names:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
      name:{
      },
      company:{
        fontStyle: 'italic',
      }
    };

    const person = this.props.person;
    const avatar = <AvatarView obj={person}/>;
    const isNew = person.get('isNew') ? <span className="label label-success">new</span> : <div/>
    const personView = () => {
     if(authManager.person.isAuthorized('view')){
      return <a href="#" onClick={this.handleViewPerson}>{person.get('name')}</a>;
     }else{
      return <span>{person.get('name')}</span>;
     }
    }
    
    return (
      <div style={styles.container} >
        <div style={styles.containerLeft}>
          <div className="p-r-1">
            <a href="#" onClick={this.handleViewPerson}>{avatar}</a>
          </div>
          <div style={styles.names}>
            <div style={styles.name} className="p-r-1">
              {personView()}
            </div>
            {companyView()}
          </div>
          <div className="p-r-1">
            {isNew}
          </div>
        </div>
        <div style={styles.containerRight} href="#">
          {this.props.children}
        </div>
      </div>
    );
  }
}


