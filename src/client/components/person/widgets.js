import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import routes from '../../routes';
import {AvatarView, NewLabel, UpdatedLabel} from '../widgets';
import {authable} from '../../components/authmanager';
import {personsActions} from '../../actions/persons';
import {pushRoute} from '../../actions/routes';
import ReactTooltip from 'react-tooltip'


export const Edit = authable(({person}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    dispatch(pushRoute(routes.person.edit, {personId: person.get('_id')}));
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
})

Edit.propTypes = {
  person: PropTypes.object.isRequired
}

export const Delete = authable(({person, postAction}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    const answer = confirm(`Are you sure to delete the contact "${person.get('name')}"`);
    if(answer){
      dispatch(personsActions.delete(person.toJS()));
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
})

Delete.propTypes = {
  person:     PropTypes.object.isRequired,
  postAction: PropTypes.func
}

export const Preferred = authable(({person, active}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    dispatch(personsActions.togglePreferred(person.toJS()));
  }

  const classnames = classNames("iconButton star fa fa-star-o", {
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
})

Preferred.propTypes = {
  person: PropTypes.object.isRequired,
  active: PropTypes.bool
}

@authable
export class AddButton extends Component {

  handleClick = () => {
    this.context.dispatch(pushRoute(routes.person.new));
  }

  render(){
    const {authManager} = this.context;
    const style = {
        position: 'fixed',
        display: 'block',
        right: 0,
        bottom: 0,
        marginRight: '30px',
        marginBottom: '30px',
        zIndex: '900',
    }

    const {title} = this.props

    if(!authManager.person.isAuthorized('add')){
      return <div/>
    } else {
      return (
        <div>
          <button id="addObject" type="button" className="btn-primary btn" data-tip={title} data-for="addPerson" style={style} onClick={this.handleClick}>
            <i className="fa fa-plus"/>
          </button>
          <ReactTooltip id="addPerson" place="left" effect="solid" />
        </div>
      )
    }
  }
}

AddButton.propTypes = {
  title: PropTypes.string
}

@authable
export class Preview extends Component {
  state = {showActions: false}

  shouldComponentUpdate(nextProps, nextState){
    return this.props.person !== nextProps.person ||
      this.props.company !== nextProps.company ||
      this.state.showActions !== nextState.showActions;
  }

  handleViewPerson = (e) => {
    e.preventDefault();
    this.context.dispatch(pushRoute(routes.person.view, {personId: this.props.person.get('_id')}));
  }

  handleViewCompany = (e) => {
    e.preventDefault();
    this.context.dispatch(pushRoute(routes.company.view, {companyId: this.props.company.get('_id')}));
  }

  handleMouseEnter = (e) => {
    this.setState({showActions: true})
  }

  handleMouseLeave = (e) => {
    this.setState({showActions: false})
  }

  render() {
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
        position: 'absolute',
        top: '10px',
        right: '0px',
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
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      },
      label:{
        color: '#cfd2da',
        padding: '.3rem',
      },
      preferred:{
        paddingRight: '15px',
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

    const actions = () => {
      if(!this.state.showActions) return <div/>;
      return(
        <div style={styles.containerRight} href="#">
          {this.props.children}
        </div>
      )
    }

    return (
      <div style={styles.container} onMouseOver={this.handleMouseEnter} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div style={styles.containerLeft}>
            <div>
              <a href="#" onClick={this.handleViewPerson}>{avatar}</a>
            </div>
            <div style={styles.preferred}>
              <Preferred person={person} active={true}/>
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
        {actions()}
      </div>
    );
  }
}

Preview.propTypes = {
  person:   PropTypes.object.isRequired,
  company:  PropTypes.object,
  children: PropTypes.node
}
