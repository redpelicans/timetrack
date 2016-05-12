import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import routes from '../../routes';
import {authable} from '../../components/authmanager';
import {AvatarView, NewLabel, UpdatedLabel} from '../widgets';
import {pushRoute} from '../../actions/routes';
import {missionsActions} from '../../actions/missions';
import ReactTooltip from 'react-tooltip'

export const Closed = ({mission}) => {
  if(mission.get('isClosed')) return <i className="iconButton fa fa-lock"/>;
  else return <div/>
}

Closed.propTypes = {
  mission: PropTypes.object.isRequired
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
        <i className="iconButton fa fa-pencil"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-pencil"/>
  }
})

Edit.propTypes = {
  mission: PropTypes.object.isRequired
}

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
        <i className="iconButton fa fa-lock"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-lock"/>
  }
})

Close.propTypes = {
  mission:    PropTypes.object.isRequired,
  postAction: PropTypes.func
}

export const OpenClose = ({mission, postAction}) => {
  return mission.get('isClosed') ? <Open mission={mission} postAction={postAction}/> : <Close mission={mission} postAction={postAction}/>;
}

OpenClose.propTypes = {
  mission:    PropTypes.object.isRequired,
  postAction: PropTypes.func
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
        <i className="iconButton fa fa-unlock"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-unlock"/>
  }
})

Open.propTypes = {
  mission:    PropTypes.object.isRequired,
  postAction: PropTypes.func
}

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
        <i className="iconButton fa fa-trash"/>
      </a>
    )
  }else{
    return <i className="iconButton disable fa fa-trash"/>
  }
})

Delete.propTypes = {
  mission:    PropTypes.object.isRequired,
  postAction: PropTypes.func
}

@authable
export class AddButton extends Component {

  handleClick = () => {
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

    const {title} = this.props

    if(!authManager.mission.isAuthorized('new')){
      return <div/>
    } else {
      return (
        <div>
          <button id="addObject" type="button" className="btn-primary btn" data-tip={title} data-for="addMission" style={style} onClick={this.handleClick}>
            <i className="fa fa-plus"/>
          </button>
          <ReactTooltip id="addMission" place="left" effect="solid" />
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
    const {authManager, dispatch} = this.context;
    const companyView = () => {
      const company = this.props.company;
      if(!company) return '';
      return <div style={styles.company}> <a href="#" onClick={this.handleViewCompany}>{company.get('name')}</a> </div> ;
    }

    const styles = {
      container:{
        display: 'flex',
        height: '100%',
        alignItems: 'center',
      },
      containerLeft: {
        flex: 0.9,
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        flexGrow: 1.8,
      },
      containerRight: {
        zIndex: 2,
        width: '18px',
        paddingLeft: '5px',
      },
      names: {
        paddingLeft: '10px',
        paddingRight: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
      name: {
      },
      company: {
        fontStyle: 'italic',
      },
      isnew: {
        position: 'absolute',
        bottom: '0',
        right: '0.1rem',
      },
      mainAvatar: {
        display: 'flex',
        paddingTop: '12px',
        paddingBottom: '12px',
      },
      manager: {
        position: 'relative',
        right: '18px',
        top: '28px',
      },
      workers: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        flexWrap: 'wrap',
      },
      worker: {
        color: '#cfd2da',
        marginLeft: '4px',
        marginTop: '4px',
      },
      avatar: {
        paddingRight: '10px',
      },
    };

    const mission = this.props.mission;
    const company = this.props.company;
    const workers = this.props.workers;
    const avatar = <AvatarView style={styles.avatar} obj={company}/>;

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

      return workers.map((worker, i) => {
        return (
          <div key={i} style={styles.worker}>
            <a href="#" onClick={onClick.bind(null, worker)}>
              <AvatarView obj={worker} size={24} label={`Worker ${worker.get('name')}`}/>
            </a>
          </div>
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
        <div href="#">
          {this.props.children}
        </div>
      )
    }

    return (
      <div style={styles.container} onMouseOver={this.handleMouseEnter} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div style={styles.containerLeft}>
          <div style={styles.mainAvatar}>
            <a href="#" onClick={this.handleViewMission}>{avatar}</a>
            <div style={styles.manager}> {manager()} </div>
          </div>
          <div style={styles.isnew}>
            {isNew()}
          </div>
          <div style={styles.names}>
            <div style={styles.name}>
              {missionView()}
            </div>
            {companyView()}
          </div>
          <div style={styles.workers}>
            {workersView()}
          </div>
        </div>
        <div style={styles.containerRight}>
          {actions()}
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  mission:  PropTypes.object.isRequired,
  company:  PropTypes.object.isRequired,
  workers:  PropTypes.object.isRequired,
  manager:  PropTypes.object,
  children: PropTypes.node,
}
