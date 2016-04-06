import React,{Component, PropTypes,  cloneElement} from 'react'
import _ from 'lodash'
import Immutable from 'immutable'
import moment from 'moment'
import Radium, {StyleRoot} from 'radium'
import {dmy} from '../utils';
import {AvatarView} from './widgets';
import {authable} from './authmanager';
import {pushRoute} from '../actions/routes';
import routes from '../routes';

@Radium
class Agenda extends Component{
  state = { 
    firstSelectedDate: undefined,
    lastSelectedDate: undefined,
  }

  handleMouseDown = (date) => {
    this.setState({firstSelectedDate: date, lastSelectedDate: date});
  }

  handleMouseUp = (date) => {
    this.setState({lastSelectedDate: date});
    if(this.state.firstSelectedDate <= this.state.lastSelectedDate) return this.props.onPeriodSelection(this.state.firstSelectedDate, this.state.lastSelectedDate);
    this.props.onPeriodSelection(this.state.lastSelectedDate, this.state.firstSelectedDate);
  }

  handleMouseEnter = (date) => {
    if(this.state.firstSelectedDate)this.setState({lastSelectedDate: date});
  }

  render(){
    const {date, viewMode='month', events, persons, missions} = this.props;
    const {firstSelectedDate, lastSelectedDate} = this.state;
    const currentDate = date ? moment(date) : moment();

    return (
      <Month 
        date={currentDate} 
        events={events}
        persons={persons}
        missions={missions}
        firstSelectedDate={firstSelectedDate} 
        lastSelectedDate={lastSelectedDate} 
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseEnter={this.handleMouseEnter}/>
    )
  }
}

Agenda.propTypes = {
  date: PropTypes.object,
  viewMode: PropTypes.string,
  events: PropTypes.object,
  persons: PropTypes.object,
  missions: PropTypes.object,
}

const Month = Radium(({date, events, persons, missions, firstSelectedDate, lastSelectedDate, onMouseDown, onMouseUp, onMouseEnter}) => {
  const styles = {
    days: {
      flexShrink: 1,
      flexGrow: 1,
      flexBasis: "20%",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: 'stretch',
      '@media (maxWidth: 800px)': {
        flexDirection: "column"
      }
    },
    container:{
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      marginTop: '15px',
      marginBottom: '15px',
    },
  }

  const betweenDates = (date, first, last) => {
    if(first <= last) return date >= first && date <= last
    return date >= last && date <= first
  }

  const days = () => {
    const first = date.clone().startOf('month');
    const last = date.clone().endOf('month');
    const current = first.clone().subtract(first.day() + 1, 'days');
    const cells = _.times(35, (id) => {
      current.add(1, 'day');
      const key = dmy(current);
      return <Day 
        key={key} 
        inBound={current >= first && current <= last} 
        selected={betweenDates(current, firstSelectedDate, lastSelectedDate)} 
        date={current.clone()}
        events={events}
        persons={persons}
        missions={missions}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}/>
    })
    return cells
  }

  return (
    <div style={styles.container}>
     <WeekDays/>
     <div style={styles.days}>
      {days()}
     </div>
    </div>
  )
})

Month.propTypes = {
  date: PropTypes.object.isRequired,
  events: PropTypes.object,
  persons: PropTypes.object,
  missions: PropTypes.object,
  firstSelectedDate: PropTypes.object,
  lastSelectedDate: PropTypes.object,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseEnter: PropTypes.func,
}

const WeekDays = () => {
  const styles = {
    container:{
      flexShrink: 0,
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      '@media (maxWidth: 800px)': {
        flexDirection: "column"
      },
    },
    day: {
      flexBasis: "14.2857%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      '@media (maxWidth: 800px)': {
        display: "none"
      }
    }
  }

  const days = _.map(moment.weekdaysShort(), (day, i) => {
    return <span key={i} style={styles.day}>{day}</span>
  })

  return (
    <div style={styles.container}>
      {days}
    </div>
  )
}


//@Radium
class Day extends Component{

  shouldComponentUpdate(nextProps){
    const diff = (previsous, next) => {
      const hp = previsous.reduce( (res, e) => { res[e.get('_id')] = e; return res }, {})
      const np = next.reduce( (res, e) => { res[e.get('_id')] = e; return res }, {})
      return _.some(np, e => hp[e.get('_id')] !== np[e.get('_id')] )
    }
    const key = dmy(this.props.date)
    const previous = this.props.events.get(key) || Immutable.List()
    const next = nextProps.events.get(key) || Immutable.List()

    return nextProps.selected !== this.props.selected || 
      previous.size !== next.size || 
      next.size && nextProps.persons !== this.props.persons ||
      diff(previous, next)
  }

  render(){
    console.log('render day')
    const {date, events, persons, missions, inBound, selected, onMouseEnter, onMouseDown, onMouseUp} = this.props;
    const style = {
      flexBasis: "14.2857%",
      minHeight: '75px',
      overflow: "hidden",
      backgroundColor: selected ? "#637D93" : "#434857" ,
      border:  "1px solid #68696C",
    }

    const handleMouseDown = (e) => {
      e.preventDefault();
      onMouseDown(date);
    }

    const handleMouseUp = (e) => {
      e.preventDefault();
      onMouseUp(date);
    }

    const handleMouseEnter = (e) => {
      e.preventDefault();
      onMouseEnter(date);
    }

    const key = dmy(this.props.date);

    return (
      <div style={style} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter}>
        <DayHeader date={date} inBound={inBound}/>
        <DayComponent 
          date={date} 
          persons={persons}
          missions={missions}
          events={events.get(key)}/>
      </div>

    )
  }
}

Day.propTypes = {
  date: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
  missions: PropTypes.object.isRequired,
  inBound: PropTypes.bool.isRequired,
}

const DayHeader = ({date, inBound}) => {
  const styles={
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: 'space-between',
  }

  return (
    <div style={styles}>
      <DayOfMonth date={date} inBound={inBound}/>
      <WeekNumber date={date}/>
    </div>
  )
}

DayHeader.propTypes = {
  date: PropTypes.object.isRequired,
  inBound: PropTypes.bool.isRequired,
}

const DayComponent = ({date, events, persons, missions}) => {
  const style={
    height: '100%',
  }
  const dayEvents = events && events.map(event => <Event persons={persons} missions={missions} event={event} key={event.get('_id')}/> );

  return (
    <div style={style}>
      {dayEvents}
    </div>
  )
}

DayComponent.propTypes = {
  date: PropTypes.object.isRequired,
  events: PropTypes.object,
  persons: PropTypes.object,
  missions: PropTypes.object,
}

const Event = authable(({event, persons, missions}, {authManager, dispatch}) => {
  const person = persons.get(event.get('workerId'))
  if(!person)return <div/>;

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'left',
      padding: '5px',
      margin: '5px',
      //backgroundColor: person.get('avatar').get('color'),
    }
  }

  const personView = () => {
    const onClick = (worker, e) => {
      e.preventDefault();
      dispatch(pushRoute(routes.person.view, {personId: person.get('_id')}));
    }

   if(authManager.person.isAuthorized('view')){
     return (
       <a href="#" onMouseDown={onClick.bind(null, person)}>
        <AvatarView  obj={person} size={24} label={`Worker ${person.get('name')}`}/>
      </a>
     )
   }else{
     return  <AvatarView  obj={person} size={24} label={`Worker ${person.get('name')}`}/>
   }
  }

  const label = () => {
    const onClick = (event, e) => {
      e.preventDefault();
      dispatch(pushRoute(routes.event.edit, {eventId: event.get('_id')}));
    }

    if(authManager.event.isAuthorized('edit')){
      return (
        <a href="#" onMouseDown={onClick.bind(null, event)}>
          {event.get('type')}
        </a>
      )
    }else{
      return <span>{event.get('type')}</span>
    }
  }

  return (
    <div style={styles.container}>
      <div>{personView()}</div>
      <div>{label()}</div>
    </div>
  )
})

DayComponent.propTypes = {
  event: PropTypes.object,
  persons: PropTypes.object,
  missions: PropTypes.object,
}


const DayOfMonth = ({date, inBound}) => {
  const style={
    fontSize: '0.9em',
    margin: '5px',
  }
  if(!inBound) style.color = 'grey';

  return (
    <div style={style}>{date.format("D")}</div>
  )
}

DayOfMonth.propTypes = {
  date: PropTypes.object.isRequired,
}

const WeekNumber = ({date}) => {
  const style={
    fontSize: '0.9em',
    padding: '.2rem',
    margin: '1px',
    color: '#cfd2da',
    backgroundColor: '#0275d8',
    display: 'inline-block',
    textAlign: 'center',
    verticalAlign: 'baseline',
    borderRadius: '.25rem',
  }

  if(date.day() !== 1) return <div/>

  return (
    <div style={style}>{date.format("w")}</div>
  )
}

WeekNumber.propTypes = {
  date: PropTypes.object.isRequired,
}

export default Agenda;
