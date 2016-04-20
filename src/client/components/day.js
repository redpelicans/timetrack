import _ from 'lodash'
import Immutable from 'immutable'
import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import {AvatarView} from './widgets'
import {authable} from './authmanager'
import {dmy} from '../utils'
import {pushRoute} from '../actions/routes'
import routes from '../routes'
import {getInitials} from '../lib/person'
import ReactTooltip from 'react-tooltip';
import Radium, {StyleRoot} from 'radium'


const organizeEvents = (date, events, persons, missions) => {
  const key = dmy(date)
  const dayEvents = events[key] 
  if(!dayEvents) return
  const hslots = _.reduce(dayEvents, (res, e) => { res[e.slot] = e; return res }, {})
  const maxSlot = Number(_.last(_.map(hslots, (e, slot) => slot).sort()))

  return Array.from( new Array(maxSlot + 1), (x,slot) => {
    if(hslots[slot]){
      const event = hslots[slot]
      return <Event persons={persons} event={event} missions={missions} key={slot}/>
    }else{
      return <WedgeEvent key={slot}/>
    }
  })
}

export class Day extends Component{
  shouldComponentUpdate(nextProps){
    const diff = (previous, next) => {
      const hp = _.reduce(previous, (res, e) => { res[e._id] = e; return res }, {})
      const np = _.reduce(next, (res, e) => { res[e._id] = e; return res }, {})
      return _.some( np, e => !_.isEqual(hp[e._id], np[e._id]) )
    }
    const key = dmy(this.props.date)
    const previous = this.props.events[key] || {}
    const next = nextProps.events[key] || {}

    return previous.length !== next.length ||
      next.length && nextProps.persons !== this.props.persons ||
      next.length && nextProps.missions !== this.props.missions ||
      diff(previous, next)
  }

  render(){
    console.log('render Day')
    const {date, events, persons, missions} = this.props
    const style={
      height: '100%',
    }

    return (
      <StyleRoot>
        <div style={style}>
          {organizeEvents(date, events, persons, missions)}
        </div>
      </StyleRoot>
    )
  }
}

Day.propTypes = {
  date: PropTypes.object.isRequired,
  events: PropTypes.object,
  persons: PropTypes.object,
  missions: PropTypes.object,
}

const WedgeEvent = Radium(() => {
  const styles = {
    container: {
      width: '100%',
      height: '20px',
     '@media (max-width: 800px)': {
        display: "none",
     }
    }
  }

  return <div style={styles.container}/>

})

const Event = authable(Radium(({event, persons, missions}, {authManager, dispatch}) => {
  const person = persons.get(event.workerId)
  const mission = missions.get(event.missionId)


  if(!person)return <div/>;

  const styles = {
    container: {
      width: '100%',
      height: '20px',
      backgroundColor: person.get('avatar').get('color'),
      display: 'flex',
      justifyContent: 'flex-start',
      flexWrap: 'nowrap',
      overflow: 'hidden',
      alignItems: 'center',
      marginRight: '-1px',
      marginBottom: '2px',
      marginTop: '2px',
      cursor: 'pointer',
    },
    pointer:{
      cursor: 'pointer',
    },
    name:{
      fontSize: '.9em',
      marginLeft: '5px',
      marginRight: '2px',
    },
    type:{
      fontSize: '.9em',
      marginLeft: '5px',
      marginRight: '2px',
      whiteSpace: 'nowrap',
    },
    details:{
     '@media (min-width: 800px)': {
        display: "none",
     }
    },
  }

  const initials = getInitials(person.get('name'))

  const personView = () => {
    const onClick = (worker, e) => {
      e.stopPropagation();
      dispatch(pushRoute(routes.person.view, {personId: person.get('_id')}));
    }

   if(authManager.person.isAuthorized('view')){
     return (
       <a href="#" onMouseDown={onClick.bind(null, person)}>
        <span data-tip={person.get('name')}>{initials}</span>
        <ReactTooltip effect="solid" />
      </a>
     )
   }else{
     return  (
       <div>
        <span data-tip={person.get('name')}>{initials}</span>
        <ReactTooltip effect="solid" />
      </div>
     )
   }
  }

  const missionView = () => {
    if(!mission)return

    const onClick = (mission, e) => {
      e.stopPropagation();
      dispatch(pushRoute(routes.mission.view, {missionId: mission.get('_id')}));
    }

   if(authManager.mission.isAuthorized('view')){
     return (
       <a href="#" onMouseDown={onClick.bind(null, mission)}>
        <span data-tip={mission.get('name')}>{mission.get('name')}</span>
        <ReactTooltip effect="solid" />
      </a>
     )
   }else{
     return  (
       <div>
        <span data-tip={mission.get('name')}>{mission.get('name')}</span>
        <ReactTooltip effect="solid" />
      </div>
     )
   }
  }

  const label = () => {
    const onClick = (event, e) => {
      e.stopPropagation();
      dispatch(pushRoute(routes.event.edit, {eventId: event._id}));
    }

    const name = event.type
    if(authManager.event.isAuthorized('edit')){
      return (
        <a href="#" onMouseDown={onClick.bind(null, event)}>
          {name}
        </a>
      )
    }else{
      return <span>{name}</span>
    }
  }

  const onClick = (e) => {
    e.stopPropagation();
    dispatch(pushRoute(routes.event.edit, {eventId: event._id}));
  }

  if(authManager.event.isAuthorized('edit')){
    return (
      <div style={[styles.container, styles.pointer]} onMouseDown={onClick}>
        <div style={[styles.name, !event.firstOfWeek && styles.details]}>{personView()}</div>
        <div style={[styles.type, !event.firstOfWeek && styles.details]}>{label()}</div>
        <div style={[styles.type, !event.firstOfWeek && styles.details]}>{missionView()}</div>
      </div>
    )
  }else{
    return (
      <div style={styles.container}>
        <div style={[styles.name, !event.firstOfWeek && styles.details]}>{personView()}</div>
        <div style={[styles.type, !event.firstOfWeek && styles.details]}>{label()}</div>
        <div style={[styles.type, !event.firstOfWeek && styles.details]}>{missionView()}</div>
      </div>
    )
  }
}))



Event.propTypes = {
  event: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
  missions: PropTypes.object,
}

