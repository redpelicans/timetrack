import React, {Component} from 'react';
import classNames from 'classnames';
import routes from '../../routes';
import {navActions} from '../../models/nav';
import {missionsActions} from '../../models/missions';
import {missionsAppActions} from '../../models/missions-app';
import authManager from '../../auths';
import {AvatarView, NewLabel, UpdatedLabel} from '../widgets';


export const Edit = ({mission}) => {
  const handleChange = (e) => {
    e.preventDefault();
    navActions.push(routes.mission.edit, {missionId: mission.get('_id')});
  }

  if(authManager.mission.isAuthorized('edit')){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-pencil m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-pencil m-r-1"/>
  }
}


export const Delete =({mission, postAction}) => {
  const handleChange = (e) => {
    e.preventDefault();
    const answer = confirm(`Are you sure to delete the mission "${mission.get('name')}"`);
    if(answer){
      missionsActions.delete(mission.toJS());
      if(postAction) postAction();
    }
  }

  if(authManager.mission.isAuthorized('delete')){
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
    navActions.push(routes.mission.new);
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

    if(!authManager.mission.isAuthorized('add')){
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
    return this.props.mission !== nextProps.mission || this.props.company !== nextProps.company;
  }

  handleViewMission = (e) => {
    e.preventDefault();
    navActions.push(routes.mission.view, {missionId: this.props.mission.get('_id')});
  }

  handleViewCompany = (e) => {
    e.preventDefault();
    navActions.push(routes.company.view, {companyId: this.props.company.get('_id')});
  }

  render() {
    console.log("render Mission")
    
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
    };

    const mission = this.props.mission;
    const company = this.props.company;
    const avatar = <AvatarView obj={company}/>;
    const isNew = () =>{
      if(mission.get('isNew')) return <NewLabel/> 
      if(mission.get('isUpdated')) return <UpdatedLabel/> 
      return <div/>
    }

    const missionView = () => {
     if(authManager.mission.isAuthorized('view')){
      return <a href="#" onClick={this.handleViewMission}>{mission.get('name')}</a>;
     }else{
      return <span>{mission.get('name')}</span>;
     }
    }
    
    return (
      <div style={styles.container} >
        <div style={styles.containerLeft}>
          <div className="p-r-1">
            <a href="#" onClick={this.handleViewMission}>{avatar}</a>
          </div>
          <div style={styles.isnew}>
            {isNew()}
          </div>
          <div style={styles.names}>
            <div style={styles.name} className="p-r-1">
              {missionView()}
            </div>
            {companyView()}
          </div>
        </div>
        <div style={styles.containerRight} href="#">
          {this.props.children}
        </div>
      </div>
    );
  }
}


