import {requestJson} from '../utils';
import Immutable from 'immutable';
import moment from 'moment';
import _ from 'lodash';
import {dmy} from '../utils';

export const LOAD_EVENTS = 'LOAD_EVENTS';
export const EVENTS_LOADED = 'EVENTS_LOADED';
export const EVENT_CREATED = 'EVENT_CREATED';
export const EVENT_UPDATED = 'EVENT_UPDATED';
export const EVENT_DELETED = 'EVENT_DELETED';


function eventsLoaded(from, to, events){
  return {
    type: EVENTS_LOADED,
    events: Immutable.fromJS(_.reduce(events, (res, p) => { res[p._id] = Maker(p); return res}, {})),
  }
}

export function loadEvents(from, to, {persons, missions} = {}){
  return (dispatch, getState) => {
    //const state = getState();
    const rfrom = from.clone().startOf('month').subtract(10, 'days');
    const rto = to.clone().endOf('month').add(10, 'days');

    //if(datesCached(state, rfrom, fto)) return;

    const url = `/api/events?from=${dmy(rfrom)}&to=${dmy(rto)}`;
    requestJson(url, {dispatch, getState, message: 'Cannot load events, check your backend server'})
      .then( events => {
        dispatch(eventsLoaded(rfrom, rto, events));
      });
  }
}

export function createEvent(event){
  return (dispatch, getState) => {
    requestJson('/api/events', {dispatch, getState, verb: 'post', body: {event}, message: 'Cannot create event, check your backend server'})
      .then( event => dispatch(createCompleted(event)));
  }
}

export function createCompleted(event){
  return {
    type: EVENT_CREATED,
    event: Immutable.fromJS(Maker(event))
  }
}

export function updateEvent(previous, updates){
  return (dispatch, getState) => {
    requestJson('/api/event', {dispatch, getState, verb: 'put', body: {event: _.assign({}, previous, updates)}, message: 'Cannot update event, check your backend server'})
      .then( event => {
        dispatch(updateCompleted(event));
      });
  }
}

export function updateCompleted(event){
  return {
    type: EVENT_UPDATED,
    event: Immutable.fromJS(Maker(event))
  }
}

export function deleteEvent(event){
  return (dispatch, getState) => {
    const id = event._id;
    requestJson(`/api/event/${id}`, {dispatch, getState, verb: 'delete', message: 'Cannot delete event, check your backend server'})
      .then( res => dispatch(deleteCompleted(event)) );
  }
}

export function deleteCompleted(event){
  return {
    type: EVENT_DELETED,
    id: event._id
  }
}

export const eventsActions = {
  load: loadEvents,
  create: createEvent,
  update: updateEvent,
  delete: deleteEvent,
  createCompleted,
  deleteCompleted,
  updateCompleted
}

function Maker(obj){
  if(obj.createdAt) obj.createdAt = moment(obj.createdAt || new Date(1967, 9, 1));
  if(obj.updatedAt) obj.updatedAt = moment(obj.updatedAt || new Date(1967, 9, 1));
  obj.startDate = moment(obj.startDate).toDate();
  obj.endDate = moment(obj.endDate).toDate();
  obj.typeName = "event";
  return obj;
}


