import React,{Component} from 'react'
import Radium from 'radium'

import CalendarBase,{CalendarGrid, WeekDays} from './calendarkit'
////////////////////////////////////////////////////////////////////////////////
// Cells

// Awesome Clicky cell
class ClickyCell extends Component {

  state = {click: false}

  header = ({id, date}) =>
    <div>{id}</div>

  content = ({id, date}) =>
    <div>{date.date()}</div>

  handleClick = ({id, date}) => (e) => {
    this.setState({click: !this.state.click})
  }

  render () {
    const { id, date } = this.props
    return (
      <div
        style={{
          height: "100%",
          backgroundColor: "#434857",
          border: this.state.click ? "1px solid firebrick": "1px solid dodgerblue",
        }}
        onClick={this.handleClick(this.props)}
      >
        {this.header(this.props)}
        {this.content(this.props)}
      </div>
    )
  }
}

// Mini agenda cell
const MiniCell = ({id, date}) =>
  <div onClick={(e) => { alert(date.date()) }}>
    {date.date()}
  </div>

// POC Pokemon - pokepoc ;)
const PokeCell = ({id, date}) => {
  const styles = { width: "100%" }
  return (
    <img style={styles} src={`http://pokeapi.co/media/sprites/pokemon/${date.date()}.png`} />
  )
}

////////////////////////////////////////////////////////////////////////////////
// Agenda Stateless Functionnal Components <3
const _Month = ({date, style}) =>
  <span style={[style]}>{date.format('MMMM')}</span>
const Month = Radium(_Month)

const _Year = ({date, style}) =>
  <span style={style}>{date.format('YYYY')}</span>
const Year = Radium(_Year)

const _PrevMonth = (props) =>
  <button {...props}>{'<<<'}</button>
const PrevMonth = Radium(_PrevMonth)

const _NextMonth = (props) =>
  <button {...props}>{'>>>'}</button>
const NextMonth = Radium(_NextMonth)

const _Today = (props) =>
  <button {...props}>{'today'}</button>
const Today = Radium(_Today)

////////////////////////////////////////////////////////////////////////////////
// AgendaApp
class AgendaApp extends CalendarBase {

  render () {
    // public
    // - state { today, date } // State
    // - Calendar              // Component
    // - composeCell           // function
    // - prevMonth             // function
    // - nextMonth             // function
    // - today                 // function

    const styles = {
      Cell: {
        height: "20%",
      },
      Header: {
        height: "70px",
      },
      CalendarGrid: {
        height: "calc(100% - 70px)",
        '@media (max-width: 480px)': {
          flexDirection: "column"
        }
      },
      _Month: {
        display: "inline-block",
        textAlign: "center",
        width: "100px"
      },
      _Year: {
        display: "inline-block",
        width: "50px"
      },
      _WeekDays: {
        week: {
          '@media (max-width: 480px)': {
            display: "none"
          }
        },
        day: {
        }
      }
    }

    const Calendar      = this.Calendar
    const Header        = this.container('Header')
    const Container     = this.container('Container')
    const CellComponent = this.composeCell(ClickyCell, styles.Cell)

    const {events}      = this.props

    return (
      <Calendar styles={styles}>
        <Header>
          <Today onClick={this.reset} />
          <PrevMonth onClick={this.prevMonth} />
          <Month />
          <Year />
          <NextMonth onClick={this.nextMonth} />
          <WeekDays />
        </Header>
        <CalendarGrid CellComponent={CellComponent} />
      </Calendar>
    )
  }
}

export default AgendaApp
