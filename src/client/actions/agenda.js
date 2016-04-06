import {requestJson} from '../utils';
import {eventsActions} from './events';
import Immutable from 'immutable';
import moment from 'moment';
import _ from 'lodash';

export const AGENDA_LOADED = 'AGENDA_LOADED';
export const AGENDA_PERIOD_CHANGED = 'AGENDA_PERIOD_CHANGED';
export const AGENDA_FILTER_CHANGED = 'AGENDA_FILTER_CHANGED';

function agendaLoaded(from, to){
  return {
    type: AGENDA_LOADED,
    from,
    to
  }
}

export function loadAgenda(from, to, {persons, missions, forceReload=false, ids=[]} = {}){
  return (dispatch, getState) => {
    dispatch(eventsActions.load(from, to));
    dispatch({ type: AGENDA_PERIOD_CHANGED, from, to });
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
    const {agenda} = getState();
    const unit = {month: 'month'}[agenda.viewMode] || 'month';
    const [from, to] = [agenda.from.clone().add(count, unit).startOf(unit), agenda.from.clone().add(count, unit).endOf(unit)];

    dispatch(eventsActions.load(from, to));
    dispatch({ type: AGENDA_PERIOD_CHANGED, from, to });
  }
}

export function subtractPeriod(count){
  return (dispatch, getState) => {
    const {agenda} = getState();
    const unit = {month: 'month'}[agenda.viewMode] || 'month';
    const [from, to] = [agenda.from.clone().subtract(count, unit).startOf(unit), agenda.from.clone().subtract(count, unit).endOf(unit)];

    dispatch(eventsActions.load(from, to));
    dispatch({ type: AGENDA_PERIOD_CHANGED, from, to });
  }
}

export function gotoToday(){
  return (dispatch, getState) => {
    const {agenda} = getState();
    const unit = {month: 'month'}[agenda.viewMode] || 'month';
    const [from, to] = [moment().startOf(unit), moment().endOf(unit)];

    dispatch(eventsActions.load(from, to));
    dispatch({ type: AGENDA_PERIOD_CHANGED, from, to });
  }
}

export const agendaActions = {
  load: loadAgenda,
  gotoToday,
  addPeriod,
  subtractPeriod,
  changeFilter,
}
