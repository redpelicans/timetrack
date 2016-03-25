import React,{Component, PropTypes} from 'react'
import _ from 'lodash'

import moment from 'moment'
moment.locale('fr')

function numberOfDays({month, year}) {
  return moment({month, year}).endOf('month').format('D')
}

const date = {
  year:  2016,
  month: 1,
  day:   18,
}

////////////////////////////////////////////////////////////////////////////////
// AgendaCell
const AgendaCell = ({
  date,
  id,
}) => {

  const styles = {
    display: "flex",
    flexBasis: "14.2857%",
    minHeight: "100px",
    backgroundColor: "#434857",
    border: "1px solid dodgerblue",
  }

  return (
    <div style={styles}>{id}</div>
  )
}
// -------------------------------------------------------------------------- //
AgendaCell.propTypes = {
  id: PropTypes.number.isRequired,
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// AgendaGrid
const AgendaGrid = ({
  date,
}) => {

  const styles = {
    display: "flex",
    flexWrap: "wrap",
    paddingTop: "15px",
  }

  function generateCells (date) {
    return _.times(35, (id) => {
      return <AgendaCell date={date} id={id} />
    })
  }

  return (
    <div style={styles}>
      {generateCells(date)}
    </div>
  )
}
// -------------------------------------------------------------------------- //
AgendaGrid.propTypes = {
  date: PropTypes.object.isRequired,
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// AgendaApp
const AgendaApp = () => {
  return (
    <AgendaGrid date={date} />
  )
}
// -------------------------------------------------------------------------- //
AgendaApp.propTypes = {
}
////////////////////////////////////////////////////////////////////////////////

export default AgendaApp
