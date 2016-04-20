import {requestJson} from '../utils'
import {eventsActions} from './events'
import Immutable from 'immutable'
import moment from 'moment'
import _ from 'lodash'
import {agendaPeriod} from '../lib/agenda'

export const AGENDA_LOADED = 'AGENDA_LOADED'
export const AGENDA_PERIOD_CHANGED = 'AGENDA_PERIOD_CHANGED'
export const AGENDA_FILTER_CHANGED = 'AGENDA_FILTER_CHANGED'



export function loadAgenda(date, {persons, missions, forceReload=false, ids=[]} = {}){
  return (dispatch, getState) => {
    const {from, to} = agendaPeriod(date)
    dispatch(eventsActions.load(from, to))
    dispatch({ type: AGENDA_PERIOD_CHANGED, date })
  }
}

export function changeFilter(filter){
  return {
    type: AGENDA_FILTER_CHANGED,
    missionIds: filter.missionIds,
    workerIds: filter.workerIds,
  }
}

export function addPeriod(count){
  return (dispatch, getState) => {
    const {agenda} = getState()
    const unit = 'month'
    const date = agenda.date.clone().add(count, unit).startOf(unit)
    const {from, to} = agendaPeriod(date)
    dispatch(eventsActions.load(from, to))
    dispatch({ type: AGENDA_PERIOD_CHANGED, date })
  }
}

export function subtractPeriod(count){
  return (dispatch, getState) => {
    const {agenda} = getState()
    const unit = 'month'
    const date = agenda.date.clone().subtract(count, unit).startOf(unit)
    const {from, to} = agendaPeriod(date)
    dispatch(eventsActions.load(from, to))
    dispatch({ type: AGENDA_PERIOD_CHANGED, date })
  }
}

export function gotoToday(){
  return (dispatch, getState) => {
    const {agenda} = getState()
    const unit = {month: 'month'}[agenda.viewMode] || 'month'
    const date = moment()
    const {from, to} = agendaPeriod(date)
    dispatch(eventsActions.load(from, to))
    dispatch({ type: AGENDA_PERIOD_CHANGED, date})
  }
}

export const agendaActions = {
  load: loadAgenda,
  gotoToday,
  addPeriod,
  subtractPeriod,
  changeFilter,
}
