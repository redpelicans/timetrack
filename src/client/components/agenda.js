import React,{Component, PropTypes,  cloneElement} from 'react'
import _ from 'lodash'
import Immutable from 'immutable'
import moment from 'moment'
import Radium, {StyleRoot} from 'radium'
import {dmy} from '../utils';

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
    const style = {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
    }

    return (
      <StyleRoot style={style}>
        <Month 
          date={currentDate} 
          {...others}
          firstSelectedDate={firstSelectedDate} 
          lastSelectedDate={lastSelectedDate} 
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseEnter={this.handleMouseEnter}/>
      </StyleRoot>
    )
  }
}

Agenda.propTypes = {
  date: PropTypes.object,
  dayComponent: PropTypes.func.isRequired,
  viewMode: PropTypes.string,
  style: PropTypes.object,
}

const Month = Radium(({date, firstSelectedDate, lastSelectedDate, style, ...others}) => {
  const styles = {
    // style.agenda.month
    days: {
      flexShrink: 1,
      flexGrow: 1,
      flexBasis: "20%",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: 'stretch',
      '@media (max-width: 800px)': {
        flexDirection: "column"
      }
    },
    // style.agenda.base
    container:{
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
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
        index={id} 
        style={style}
        inBound={current >= first && current <= last} 
        selected={betweenDates(current, firstSelectedDate, lastSelectedDate)} 
        date={current.clone()}
        {...others}/>
    })
    return cells
  }

  return (
    <div style={[styles.container, style.base]}>
     <WeekDays style={style}/>
     <div style={[styles.days, style.month]}>
      {days()}
     </div>
    </div>
  )
})

Month.propTypes = {
  date: PropTypes.object.isRequired,
  firstSelectedDate: PropTypes.object,
  lastSelectedDate: PropTypes.object,
  style: PropTypes.object,
}

const WeekDays = Radium(({style}) => {
  const styles = {
    container:{
      flexShrink: 0,
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      '@media (max-width: 800px)': {
        flexDirection: "column"
      },
    },
    // style.weekday
    day: {
      flexBasis: "14.2857%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      '@media (max-width: 800px)': {
        display: "none"
      }
    }
  }

  const days = _.map(moment.weekdaysShort(), (day, i) => {
    return <span key={i} style={[styles.day, style.weekday]}>{day}</span>
  })

  return (
    <div style={styles.container}>
      {days}
    </div>
  )
})

WeekDays.propTypes = {
  style: PropTypes.object,
}

const Day = Radium(({date, index, inBound, selected, onMouseEnter, onMouseDown, onMouseUp, dayComponent, style, ...others}) => {
  const styles = {
    // style.agenda.day
    container:{
      flexBasis: "14.2857%",
      minHeight: '75px',
      overflow: "hidden",
      backgroundColor: "#434857" ,
      borderStyle:  "solid",
      borderColor:  "#68696C",
    }
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

  const selectedStyle = style.selectedDay || { backgroundColor: "#637D93"}

  const bs = style.day.borderWidth || '1px'
  const borderStyle = () => {
    if(index === 28) return {borderWidth: [bs, bs, bs, bs].join(" ")}
    if(!(index%7)) return {borderWidth: [bs, bs, '0px', bs].join(" ")}
    if(index > 28) return {borderWidth: [bs, bs, bs, '0px'].join(" ")}
    return {borderWidth: [bs, bs, '0px', '0px'].join(" ")}
  }

  return (
    <div style={[styles.container, style.day, selected && selectedStyle,  borderStyle()]} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter}>
      <DayHeader style={style} date={date} inBound={inBound}/>
      <DayComponent date={date} {...others}/>
    </div>
  )
})

Day.propTypes = {
  date: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  inBound: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  dayComponent: PropTypes.func.isRequired,
  style: PropTypes.object,
}

@Radium
class DayHeader extends Component{
  shouldComponentUpdate(nextProps){
    return dmy(nextProps.date) !== dmy(this.props.date) || nextProps.inBound !== this.props.inBound
  }

  render(){
    const {date, inBound, style} = this.props
    const styles={
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: 'space-between',
    }

    return (
      <div style={styles}>
        <DayOfMonth style={style} date={date} inBound={inBound}/>
        <WeekNumber style={style} date={date}/>
      </div>
    )
  }
}

DayHeader.propTypes = {
  date: PropTypes.object.isRequired,
  inBound: PropTypes.bool.isRequired,
}

const DayOfMonth = Radium(({date, inBound, style}) => {
  // style.agenda.dayOfMonth
  const styles={
    fontSize: '0.9em',
    margin: '5px',
  }
  const outBoundStyle = style.dayOfMonthOutBound || { color: 'grey' }

  return (
    <div style={[styles, style.dayOfMonth, !inBound && outBoundStyle]}>{date.format("D")}</div>
  )
})

DayOfMonth.propTypes = {
  date: PropTypes.object.isRequired,
  style: PropTypes.object
}

const WeekNumber = Radium(({date, style}) => {
  // style.agenda.weekNumber
  const styles={
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
    <div style={[styles, style.weekNumber]}>{date.format("w")}</div>
  )
})

WeekNumber.propTypes = {
  date: PropTypes.object.isRequired,
  style: PropTypes.object
}

export default Agenda;
