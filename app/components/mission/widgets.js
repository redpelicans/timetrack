import React, {Component} from 'react';
import classNames from 'classnames';
import routes from '../../routes';
import {authable} from '../../components/authmanager';
import {AvatarView, NewLabel, UpdatedLabel} from '../widgets';
import {pushRoute} from '../../actions/routes';
import {missionsActions} from '../../actions/missions';

export const Closed = ({mission}) => {
  if(mission.get('isClosed')) return <i className="iconButton fa fa-lock m-r-1"/>;
  else return <div/>
}


export const Edit = authable(({mission}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    dispatch(pushRoute(routes.mission.edit, {missionId: mission.get('_id')}));
  }

  if(mission.get('isClosed')) return <div/>;

  if(authManager.mission.isAuthorized('edit', {mission})){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-pencil m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-pencil m-r-1"/>
  }
})

export const Close = authable(({mission, postAction}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    const answer = confirm(`Are you sure to close the mission "${mission.get('name')}"`);
    if(answer){
      dispatch(missionsActions.close(mission.toJS()));
      if(postAction) postAction();
    }
  }

  if(authManager.mission.isAuthorized('close', {mission})){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-lock m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-lock m-r-1"/>
  }
})

export const OpenClose = ({mission, postAction}) => {
  return mission.get('isClosed') ? <Open mission={mission} postAction={postAction}/> : <Close mission={mission} postAction={postAction}/>;
}

export const Open = authable(({mission, postAction}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    const answer = confirm(`Are you sure to re-open the mission "${mission.get('name')}"`);
    if(answer){
      dispatch(missionsActions.open(mission.toJS()));
      if(postAction) postAction();
    }
  }

  if(authManager.mission.isAuthorized('open', {mission})){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-unlock m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-unlock m-r-1"/>
  }
})

export const Delete = authable(({mission, postAction}, {authManager, dispatch}) => {
  const handleChange = (e) => {
    e.preventDefault();
    const answer = confirm(`Are you sure to delete the mission "${mission.get('name')}"`);
    if(answer){
      dispatch(missionsActions.delete(mission.toJS()));
      if(postAction) postAction();
    }
  }

  if(mission.get('isClosed')) return <div/>;

  if(authManager.mission.isAuthorized('delete', {mission})){
    return (
      <a href="#" onClick={handleChange}>
        <i className="iconButton fa fa-trash m-r-1"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-trash m-r-1"/>
  }
})

@authable
export class AddButton extends Component {
  componentDidMount(){
    $('#addObject').tooltip({animation: true});
  }

  handleClick = () => {
    $('#addObject').tooltip('hide');
    this.context.dispatch(pushRoute(routes.mission.new));
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

@authable
export class Preview extends Component {
  state = {showActions: false}

  shouldComponentUpdate(nextProps, nextState){
    return this.props.mission !== nextProps.mission 
    || this.props.manager !== nextProps.manager
    //|| this.props.workers !== nextProps.workers // TODO: find a way to avoid refresh each time 
    || this.props.company !== nextProps.company
    || this.state.showActions !== nextState.showActions;
  }

  handleViewMission = (e) => {
    e.preventDefault();
    this.context.dispatch(pushRoute(routes.mission.view, {missionId: this.props.mission.get('_id')}));
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
    console.log("render Mission")
    const {authManager, dispatch} = this.context; 
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
      manager:{
        position: 'absolute',
        bottom: '3px',
        left: '3rem',
      },
      workers:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      },
      worker:{
        color: '#cfd2da',
        padding: '.3rem',
      }

    };

    const mission = this.props.mission;
    const company = this.props.company;
    const workers = this.props.workers;
    const avatar = <AvatarView obj={company}/>;

    const isNew = () =>{
      if(mission.get('isUpdated')) return <UpdatedLabel/> 
      if(mission.get('isNew')) return <NewLabel/> 
      return <div/>
    }

    const missionView = () => {
     if(authManager.mission.isAuthorized('view')){
      return <a href="#" onClick={this.handleViewMission}>{mission.get('name')}</a>;
     }else{
      return <span>{mission.get('name')}</span>;
     }
    }

    const workersView = () => {
      const onClick = (worker, e) => {
        e.preventDefault();
        dispatch(pushRoute(routes.person.view, {personId: worker.get('_id')}));
      }

      if(!workers) return <div/>;

      return workers.map(worker => {
        return (
          <a key={worker.get('_id')} href="#" onClick={onClick.bind(null, worker)}>
            <AvatarView  obj={worker} size={24} label={`Worker ${worker.get('name')}`}/>
          </a>
        )
      }).toSetSeq();
    }

    const manager = () => {
     if(!this.props.manager)return;
      const onClick = (person, e) => {
        e.preventDefault();
        dispatch(pushRoute(routes.person.view, {personId: person.get('_id')}));
      }

     return (
       <a href="#" onClick={onClick.bind(null, this.props.manager)}>
         <AvatarView size={24} label={`Managed by ${this.props.manager.get('name')}`} obj={this.props.manager}/>
       </a>
     )
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
          <div className="p-r-1">
            <a href="#" onClick={this.handleViewMission}>{avatar}</a>
          </div>
          <div style={styles.isnew}>
            {isNew()}
          </div>
          <div style={styles.manager}>
            {manager()}
          </div>
          <div style={styles.names}>
            <div style={styles.name} className="p-r-1">
              {missionView()}
            </div>
            {companyView()}
          </div>
          <div className="p-r-1" style={styles.workers}>
            {workersView()}
          </div>
        </div>
        {actions()}
      </div>
    );
  }
}

