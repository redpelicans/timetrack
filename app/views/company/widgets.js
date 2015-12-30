import React, {Component} from 'react';
import classNames from 'classnames';
import authManager from '../../auths';
import {companiesActions} from '../../models/companies';
import routes from '../../routes';
import {navActions} from '../../models/nav';
import {AvatarView} from '../widgets';

export const Edit = ({company}) => {
  const handleChange = (e) => {
    e.preventDefault();
    navActions.push(routes.company.edit, {companyId: company.get('_id')});
  }

  if(authManager.company.isAuthorized('edit')){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-pencil m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-pencil m-r-1"/>
  }
}

export const Preferred = ({company, active}) => {
  const handleChange = (e) => {
    e.preventDefault();
    companiesActions.togglePreferred(company);
  }

  const classnames = classNames("iconButton star fa fa-star-o m-r-1", {
    preferred: company.get('preferred'),
  });

  if(active && authManager.company.isAuthorized('togglePreferred')){
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

export const Delete =({company, postAction}) => {
  const handleChange = (e) => {
    e.preventDefault();
    const answer = confirm(`Are you sure to delete the company "${company.get('name')}"`);
    if(answer){
      companiesActions.delete(company.toJS());
      if(postAction)postAction();
    }
  }

  if(authManager.company.isAuthorized('delete', {company})){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-trash m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-trash m-r-1"/>
  }
}


export class AddButton extends Component {
  componentDidMount(){
    $('#addObject').tooltip({animation: true});
  }

  handleClick = () => {
    $('#addObject').tooltip('hide');
    navActions.push(routes.company.new);
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

    if(!authManager.company.isAuthorized('add')){
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


