import _ from 'lodash'
import ReactTooltip from 'react-tooltip'
import React, {Component, PropTypes} from 'react'
import classNames from 'classnames'

import routes from '../../routes'
import {AvatarView, NewLabel, UpdatedLabel} from '../widgets'
import {authable} from '../authmanager'
import {personsActions} from '../../actions/persons'
import {pushRoute} from '../../actions/routes'

@authable
export class PersonPreview extends Component {
  shouldComponentUpdate(nextProps, nextState){
    return this.props.person !== nextProps.person ||
      this.props.company !== nextProps.company
  }

  handleViewPerson = (e) => {
    e.preventDefault();
    this.context.dispatch(pushRoute(routes.person.view, {personId: this.props.person.get('_id')}));
  }

  handleViewCompany = (e) => {
    e.preventDefault();
    this.context.dispatch(pushRoute(routes.company.view, {companyId: this.props.company.get('_id')}));
  }

  render() {
    console.log("render Person")
    const {authManager, dispatch} = this.context;
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
      },
      isnew:{
        position: 'absolute',
        bottom: '0',
        right: '0.1rem',
      },
      tags:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      },
      label:{
        color: '#cfd2da',
        padding: '.3rem',
      },
    };

    const person = this.props.person;
    const avatar = <AvatarView obj={person}/>;
    const isNew = () =>{
      if(person.get('isNew')) return <NewLabel/>
        if(person.get('isUpdated')) return <UpdatedLabel/>
          return <div/>
    }

    const tags = () => {
      const onClick = (tag, e) => {
        e.preventDefault();
        const filter = `#${tag} `;
        dispatch(personsActions.filter(filter));
        dispatch(pushRoute(routes.person.list, {filter}));
      }

      if(!person.get('tags') || !person.get('tags').size) return <div/>;

      return _.map(person.get('tags').toJS(), v => {
        return (
          <span key={v} style={styles.label} className="label label-primary m-r-1">
          <a href="#" onClick={onClick.bind(null, v)}>{v}</a>
          </span>
        )
      })
    }

    const personView = () => {
      if(authManager.person.isAuthorized('view')){
        return <a href="#" onClick={this.handleViewPerson}>{person.get('name')}</a>;
      }else{
        return <span>{person.get('name')}</span>;
      }
    }

    return (
      <div style={styles.container}>
        <div style={styles.containerLeft}>
          <div className="p-r-1">
            <a href="#" onClick={this.handleViewPerson}>{avatar}</a>
          </div>
          <div style={styles.isnew}>
            {isNew()}
          </div>
          <div style={styles.names}>
            <div style={styles.name} className="p-r-1">
              {personView()}
            </div>
            {companyView()}
          </div>
          <div className="p-r-1" style={styles.tags}>
            {tags()}
          </div>
        </div>
      </div>
    );
  }
}

PersonPreview.propTypes = {
  person:   PropTypes.object.isRequired,
  company:  PropTypes.object,
  children: PropTypes.node
}



