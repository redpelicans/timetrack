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

  const classnames = classNames("iconButton fa fa-trash m-r",{
    disable: companyHasPersons,
  });
    
  return (
    <a href="#" onClick={handleChange}>
      <i className={classnames}/>
    </a>
  )
}
