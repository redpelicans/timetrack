import {requestJson} from '../utils';
import Immutable from 'immutable';
import moment from 'moment';
import _ from 'lodash';

export const LOAD_MISSIONS = 'LOAD_MISSIONS';
export const MISSIONS_LOADED = 'MISSIONS_LOADED';
export const SORT_MISSIONS = 'SORT_MISSIONS';
export const FILTER_MISSIONS = 'FILTER_MISSIONS';
export const MISSION_UPDATED = 'MISSION_UPDATED';
export const MISSION_DELETED = 'MISSION_DELETED';
export const MISSION_CREATED = 'MISSION_CREATED';


export function deleteCompleted(mission){
  return {
    type: MISSION_DELETED,
    id: mission._id
  }
}

export function createCompleted(mission){
  return {
    type: MISSION_CREATED,
    mission: Immutable.fromJS(Maker(mission))
  }
}

export function updateCompleted(mission){
  return {
    type: MISSION_UPDATED,
    mission: Immutable.fromJS(Maker(mission))
  }
}

export function missionsLoaded(missions){
  return {
    type: MISSIONS_LOADED,
    missions: Immutable.fromJS(_.reduce(missions, (res, p) => { res[p._id] = Maker(p); return res}, {})),
  }
}

export function filter(filter){
  return {
    type: FILTER_MISSIONS,
    filter
  }
}

export function sort(by){
  return {
    type: SORT_MISSIONS,
    by
  }
}

export function loadMissions({forceReload=false, ids=[]} = {}){
  return (dispatch, getState) => {
    const state = getState();
    const objs = _.map(ids, id => state.missions.data.get(id));
    let doRequest = forceReload || !_.every(objs) || !state.missions.data.size;
    if(!doRequest) return;

    const url = '/api/missions';
    dispatch({type: LOAD_MISSIONS});
    requestJson(url, {dispatch, getState, message: 'Cannot load missions, check your backend server'})
      .then( missions => {
        dispatch(missionsLoaded(missions));
      });
  }
}

export function deleteMission(mission){
  return (dispatch, getState) => {
    const id = mission._id;
    requestJson(`/api/mission/${id}`, {dispatch, getState, verb: 'delete', message: 'Cannot delete mission, check your backend server'})
      .then( res => dispatch(deleteCompleted(mission)) );
  }
}

export function updateMission(previous, updates){
  return (dispatch, getState) => {
    requestJson('/api/mission', {dispatch, getState, verb: 'put', body: {mission: _.assign({}, previous, updates)}, message: 'Cannot update mission, check your backend server'})
      .then( mission => {
        dispatch(updateCompleted(mission));
      });
  }
}

export function createMission(mission){
  return (dispatch, getState) => {
    requestJson('/api/missions', {dispatch, getState, verb: 'post', body: {mission}, message: 'Cannot create mission, check your backend server'})
      .then( mission => dispatch(createCompleted(mission)));
  }
}

export const missionsActions = {
  createCompleted,
  updateCompleted,
  deleteCompleted,
  load: loadMissions,
  create: createMission,
  update: updateMission,
  delete: deleteMission,
  sort,
  filter,
}

function Maker(obj){
  if(obj.createdAt) obj.createdAt = moment(obj.createdAt || new Date(1967, 9, 1));
  if(obj.updatedAt) obj.updatedAt = moment(obj.updatedAt || new Date(1967, 9, 1));
  if(obj.startDate) obj.startDate = moment(obj.startDate).toDate();
  if(obj.endDate) obj.endDate = moment(obj.endDate).toDate();
  obj.typeName = "mission";
  return obj;
}


