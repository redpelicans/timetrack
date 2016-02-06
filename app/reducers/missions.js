import Immutable from 'immutable';
import {
  MISSION_CREATED, 
  MISSION_DELETED, 
  MISSION_UPDATED, 
  MISSIONS_LOADED, 
  LOAD_MISSIONS, 
  FILTER_MISSIONS, 
  SORT_MISSIONS, 
} from '../actions/missions';

const initialState = {
  data: Immutable.Map(),
  filter: '',
  sortCond: {
     by: 'name',
     order: 'asc'
  },
};

export default function missionsReducer(state = initialState, action) {
  switch(action.type){
    case MISSION_DELETED:
      return {
        ...state,
        data: state.data.delete( action.id ),
      }
    case MISSION_UPDATED:
    case MISSION_CREATED:
      return {
        ...state,
        data: state.data.set(action.mission.get('_id'), action.mission),
      }
    case FILTER_MISSIONS:
      return {
        ...state,
        filter: action.filter
      }
    case SORT_MISSIONS:
      const sortCond = {
        by: action.by,
        order: state.sortCond.by === action.by ? {asc: 'desc', desc: 'asc'}[state.sortCond.order] : state.sortCond.order,
      };
      return {
        ...state,
        sortCond
      }
    case MISSIONS_LOADED:
      return {
        ...state,
        data: action.missions
      }
    default: 
      return state;
  }
}
