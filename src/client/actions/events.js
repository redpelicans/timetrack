import {requestJson} from '../utils';
import Immutable from 'immutable';
import moment from 'moment';
import _ from 'lodash';

export const LOAD_EVENTS = 'LOAD_EVENTS';
export const EVENTS_LOADED = 'EVENTS_LOADED';


function eventsLoaded(events){
  return {
    type: EVENTS_LOADED,
    //events: Immutable.fromJS(_.reduce(events, (res, p) => { res[p._id] = Maker(p); return res}, {})),
    events: Immutable.fromJS(_.map(events, Maker)),
  }
}

export function loadEvents(from, to, {persons, missions, forceReload=false, ids=[]} = {}){
  return (dispatch, getState) => {
    const state = getState();
    const objs = _.map(ids, id => state.events.data.get(id));
    let doRequest = forceReload || !_.every(objs) || !state.events.data.size;
    if(!doRequest) return;

    const url = `/api/events?from=${moment(from).format("YYMMDD")}&to=${moment(to).format("YYMMDD")}`;

    requestJson(url, {dispatch, getState, message: 'Cannot load events, check your backend server'})
      .then( events => {
        dispatch(eventsLoaded(events));
      });
  }
}

export const eventsActions = {
  load: loadEvents,
}

function Maker(obj){
  if(obj.createdAt) obj.createdAt = moment(obj.createdAt || new Date(1967, 9, 1));
  if(obj.updatedAt) obj.updatedAt = moment(obj.updatedAt || new Date(1967, 9, 1));
  obj.typeName = "event";
  return obj;
}


