import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import classNames from 'classnames';


export const Delete =({company, onDelete}) => {
  const handleChange = (e) => {
    onDelete(company);
    e.preventDefault();
  }

  const companyHasPersons = company.get('personIds').size;

  if(companyHasPersons){
    return (
      <i className="iconButton disable fa fa-trash m-r"/>
    )
  }else{
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-trash m-r"/>
      </a>
    )
  }
}
