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
    const {date, viewMode='month', ...others} = this.props;
    const {firstSelectedDate, lastSelectedDate} = this.state;
    const currentDate = date ? moment(date) : moment();

    return (
      <Month 
        date={currentDate} 
        {...others}
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
  dayComponent: PropTypes.func.isRequired,
  viewMode: PropTypes.string,
}

const Month = Radium(({date, firstSelectedDate, lastSelectedDate, ...others}) => {
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
        {...others}/>
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
  firstSelectedDate: PropTypes.object,
  lastSelectedDate: PropTypes.object,
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
const Day = ({date, inBound, selected, onMouseEnter, onMouseDown, onMouseUp, dayComponent, ...others}) => {
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

  const key = dmy(date);
  const DayComponent = dayComponent;

  console.log("render day")
  return (
    <div style={style} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter}>
      <DayHeader date={date} inBound={inBound}/>
      <DayComponent date={date} {...others}/>
    </div>
  )
}

Day.propTypes = {
  date: PropTypes.object.isRequired,
  inBound: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  dayComponent: PropTypes.func.isRequired,
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
