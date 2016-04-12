import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {authable} from '../../components/authmanager';
import routes from '../../routes';
import {AvatarView, NewLabel, UpdatedLabel} from '../widgets';
import {pushRoute} from '../../actions/routes';
import {companiesActions} from '../../actions/companies';
import ReactTooltip from 'react-tooltip'

export const Edit = authable(({company}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    dispatch(pushRoute(routes.company.edit, {companyId: company.get('_id')}));
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
})

Edit.propTypes = {
  company: PropTypes.object.isRequired
}

export const Preferred = authable(({company, active}, {authManager, dispatch}) => {

  const handleChange = (e) => {
    e.preventDefault();
    dispatch(companiesActions.togglePreferred(company.toJS()));
  }

  const classnames = classNames('iconButton star fa fa-star-o m-r-1', {
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
})

Preferred.propTypes = {
  company:  PropTypes.object.isRequired,
  active:   PropTypes.bool
}

export const Delete = authable(({company, workers, postAction}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    const answer = confirm(`Are you sure to delete the company "${company.get('name')}"`);
    if(answer){
      dispatch(companiesActions.delete(company.toJS()));
      if(postAction)postAction();
    }
  }

  if(authManager.company.isAuthorized('delete', {company, workers})){
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
  company:    PropTypes.object.isRequired,
  workers:    PropTypes.object.isRequired,
  postAction: PropTypes.func
}

@authable
export class AddButton extends Component {

  handleClick = () => {
    this.context.dispatch(pushRoute(routes.company.new));
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

    const {title} = this.props

    if(!this.context.authManager.company.isAuthorized('add')){
      return <div/>
    } else {
      return (
        <div>
          <button id="addObject" type="button" className="btn-primary btn" data-tip={title} data-for="addCompany" style={style} onClick={this.handleClick}>
            <i className="fa fa-plus"/>
          </button>
          <ReactTooltip id="addCompany" place="left" effect="solid" />
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
    return this.props.company !== nextProps.company ||
        this.state.showActions !== nextState.showActions;
  }

  handleView = (e) => {
    e.preventDefault();
    this.context.dispatch(pushRoute(routes.company.view,  {companyId: this.props.company.get('_id')}));
  }

  handleMouseEnter = (e) => {
    this.setState({showActions: true})
  }

  handleMouseLeave = (e) => {
    this.setState({showActions: false})
  }


  render() {
    function amount(value){
      if(!value) return;
      return `${Math.round(value/1000)} k€`;
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
        alignItems: 'center',
        height: '100%',
      },
      containerLeft:{
        flex: 0.9,
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        flexGrow: 1.8,
      },
      containerRight:{
        width: '18px',
        paddingLeft: '5px',
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
        position: 'relative',
        right: '12px',
        top: '24px',
      },
      avatar: {
      },
    };

    const {company, workers} = this.props
    const avatar = <AvatarView style={styles.avatar} obj={company}/>

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

    const actions = () => {
      if(!this.state.showActions) return <div style={styles.containerRight}></div>;
      return (
        <div style={styles.containerRight} href="#">
          <Edit company={company}/>
          <Delete workers={workers} company={company}/>
        </div>
      )
    }

    return (
      <div style={styles.container} onMouseOver={this.handleMouseEnter} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} >
        <div style={styles.containerLeft}>
          <div>
            {avatarView()}
          </div>
           <div style={styles.preferred}>
            <Preferred company={company} active={true}/>
          </div>
          <div style={styles.isnew}>
            {isNew()}
          </div>
          <div>
            {companyNameView()}
          </div>
          <div className="p-r-1">
            {billAmounts(company)}
          </div>
          <div>
            {tags()}
          </div>
        </div>
        {actions()}
      </div>
    );
  }
}

Preview.propTypes = {
  company: PropTypes.object.isRequired,
  workers: PropTypes.object.isRequired,
}
