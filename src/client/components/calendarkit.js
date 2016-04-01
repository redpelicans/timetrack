import React,{Component, PropTypes,  cloneElement} from 'react'
import _ from 'lodash'

import moment from 'moment'
// moment.locale('fr')

import Radium,{StyleRoot} from 'radium'

////////////////////////////////////////////////////////////////////////////////
// CalendarGrid
@Radium
export class CalendarGrid extends Component {

  styles = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  }

  generateCells = (date, CellComponent) => {

    let first = date.clone().startOf('month')

    first.subtract(first.day() + 1, 'days')

    const cells = _.times(35, (id) => {
      first.add(1, 'days')
      return <CellComponent
                key={id}
                date={first.clone()}
                id={id} />
    })
    return cells
  }

  render () {
    const {date, CellComponent, style} = this.props
    return (
      <div style={[this.styles, style]}>
        {this.generateCells(date, CellComponent)}
      </div>
    )
  }

}
// -------------------------------------------------------------------------- //
CalendarGrid.propTypes = {
  date: PropTypes.object,
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// WeekDays
@Radium
export class WeekDays extends Component {

  styles = {
    day: {
      flexBasis: "14.2857%",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    week: {
      display: "flex",
      flexWrap: "wrap",
    }
  }

  generateDays (style) {
    return _.map(moment.weekdays(), (day, i) => {
      return <span key={i} style={[this.styles.day, style && style.day]}>{day}</span>
    })
  }

  render () {
    const {style} = this.props
    return (
      <div style={[this.styles.week, style && style.week]}>
        {this.generateDays(style)}
      </div>
    )
  }
}
// -------------------------------------------------------------------------- //
WeekDays.propTypes = {
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// AgendaBase
class CalendarBase extends Component {

  state = {today: moment(), date: moment().startOf('month')}

  nextMonth = () => {
    this.setState({date: this.state.date.clone().endOf('month').add(1, 'days')})
  }

  prevMonth = () => {
    this.setState({date: this.state.date.clone().startOf('month').subtract(1, 'days')})
  }

  reset = () => {
    this.setState({date: this.state.today})
  }

  Calendar = ({children, styles}) => {
    const childrenWithProps = React.Children.map(children, (e) => {
      const style = styles[e.type.displayName]
      return cloneElement(e, {date: this.state.date, style, styles})
    })
    return <StyleRoot style={{width: "100%", height:"100%"}}>{childrenWithProps}</StyleRoot>
  }

  container = (name) => {
    return React.createClass({
      displayName: name,
      render() {
        const {date, children, styles, ...props} = this.props
        const childrenWithProps = React.Children.map(children, (e) => {
          const style = styles[e.type.displayName]
          return cloneElement(e, {date, style, styles})
        })
        return <div {...props}>{childrenWithProps}</div>
      }
    })
  }

  composeCell = (CustomComponent, style) => {

    class CalendarCell extends Component {
      render () {

        const _style = () => {
          return {
            flexBasis: "14.2857%",
            overflow: "hidden",
            ...style
          }
        }

        return (
          <div style={_style()}>
            <CustomComponent {...this.state} {...this.props} />
          </div>
        )
      }
    }
    CalendarCell.propTypes = {
      id: PropTypes.number.isRequired,
    }

    return CalendarCell
  }

}
// -------------------------------------------------------------------------- //
CalendarBase.propTypes = {
}
////////////////////////////////////////////////////////////////////////////////

export default CalendarBase
