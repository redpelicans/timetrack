import _ from 'lodash'
import ReactTooltip from 'react-tooltip'
import React, {Component, PropTypes} from 'react'
import classNames from 'classnames'

import routes from '../../routes'
import {AvatarView, NewLabel, UpdatedLabel} from '../widgets'
import {authable} from '../authmanager'
import {personsActions} from '../../actions/persons'
import {companiesActions} from '../../actions/companies'
import {pushRoute} from '../../actions/routes'

@authable
export class PersonPreview extends Component {
  shouldComponentUpdate(nextProps, nextState){
    return this.props.person !== nextProps.person ||
      this.props.company !== nextProps.company
  }

  handleViewPerson = (e) => {
    e.preventDefault()
    this.context.dispatch(pushRoute(routes.person.view, {personId: this.props.person.get('_id')}));
  }

  handleViewCompany = (e) => {
    e.preventDefault()
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
      } else{
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

//__________________________________________________________________________________________

@authable
export class CompanyPreview extends Component {
  //state = {showActions: false}

  shouldComponentUpdate(nextProps, nextState){
    return this.props.company !== nextProps.company /*||*/
      //this.state.showActions !== nextState.showActions;
  }

  handleView = (e) => {
    e.preventDefault();
    this.context.dispatch(pushRoute(routes.company.view,  {companyId: this.props.company.get('_id')}));
  }

  /*handleMouseEnter = (e) => {
    this.setState({showActions: true})
  }

  handleMouseLeave = (e) => {
    this.setState({showActions: false})
  }*/


  render() {
    function amount(value){
      if(!value) return;
      return `${Math.round(value/1000)} k`;
    }


    function billAmount(company, type){
      const name = {billed: 'Billed', billable: 'Billable'};
      if(company[type]){
        return (
          <div style={styles[type]}>
          <span>{name[type]}: {amount(company[type] || 0 )}</span>
          </div>
        )
      }else{
        return <div style={styles[type]}/>
      }
    }

    function billAmounts(company){
      if(company.billed || company.billable){
        return (
          <span className="label label-default">{[amount(company.billed), amount(company.billable)].join(' / ')}</span>
        )
      }
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
      /*preferred:{
        position: 'absolute',
        bottom: '3px',
        left: '3rem',
      },*/
    };

    const {company, workers} = this.props
    const avatar = <AvatarView obj={company}/>

    const isNew = () =>{
      if(company.get('isNew')) return <NewLabel/>
        if(company.get('isUpdated')) return <UpdatedLabel/>
          return <div/>
    }

    const tags = () => {
      const onClick = (tag, e) => {
        e.preventDefault();
        const filter = `#${tag} `;
        this.context.dispatch(companiesActions.filter(filter));
        this.context.dispatch(pushRoute(routes.company.list, {filter}));
      }

      if(!company.get('tags') || !company.get('tags').size) return <div/>;

      return _.map(company.get('tags').toJS(), v => {
        return (
          <span key={v} style={styles.label} className="label label-primary m-r-1">
          <a href="#" onClick={onClick.bind(null, v)}>{v}</a>
          </span>
        )
      })
    }

    const avatarView = () => {
      if(this.context.authManager.company.isAuthorized('view')) return  <a href="#" onClick={this.handleView}>{avatar}</a>;
      else return {avatar}
    }
    const companyNameView = () => {
      if(this.context.authManager.company.isAuthorized('view')) return  <a href="#" onClick={this.handleView}>{company.get('name')}</a>;
      else return <span>{company.get('name')}</span>
    }

    /*const actions = () => {
      if(!this.state.showActions) return <div/>;
      return(
        <div style={styles.containerRight} href="#">
        </div>
      )
    }*/

    return (
      <div style={styles.container}>
        <div style={styles.containerLeft}>
          <div className="p-r-1">
            {avatarView()}
          </div>
          <div style={styles.isnew}>
            {isNew()}
          </div>
          <div className="p-r-1">
            {companyNameView()}
          </div>
          <div className="p-r-1">
            {billAmounts(company)}
          </div>
          <div className="p-r-1">
            {tags()}
          </div>
        </div>
      </div>
    )
  }
}

CompanyPreview.propTypes = {
  company: PropTypes.object.isRequired,
  workers: PropTypes.object.isRequired,
}
