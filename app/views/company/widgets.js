import React, {Component} from 'react';
import classNames from 'classnames';
import authManager from '../../auths';
import {companiesActions} from '../../models/companies';
import {companiesAppActions} from '../../models/companies-app';
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

export class Preview extends Component {
  shouldComponentUpdate(nextProps, nextState){
    return this.props.company !== nextProps.company;
  }

  handleView = (e) => {
    e.preventDefault();
    navActions.push(routes.company.view, {companyId: this.props.company.get('_id')});
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
      }
    };

    const company = this.props.company;
    const avatar = <AvatarView obj={company}/>;

    const isNew = () =>{
      if(company.get('isNew')) return <NewLabel/> 
      if(company.get('isUpdated')) return <UpdatedLabel/> 
      return <div/>
    }

    const tags = () => {
      const onClick = (tag, e) => {
        e.preventDefault();
        const filter = `#${tag} `;
        companiesAppActions.filter(filter);
        navActions.push(routes.company.list, {filter});
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
      if(authManager.company.isAuthorized('view')) return  <a href="#" onClick={this.handleView}>{avatar}</a>;
      else return {avatar}
    }
    const companyNameView = () => {
      if(authManager.company.isAuthorized('view')) return  <a href="#" onClick={this.handleView}>{company.get('name')}</a>;
      else return <span>{company.get('name')}</span>
    }

    return (
      <div style={styles.container} >
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
        <div style={styles.containerRight} href="#">
          <Preferred company={company} active={true}/>
          <Edit company={company}/>
          <Delete company={company}/>
        </div>
      </div>
    );
  }
}

