import Immutable from 'immutable';
import {
  EVENTS_LOADED, 
  EVENT_CREATED, 
  EVENT_UPDATED, 
  EVENT_DELETED, 
} from '../actions/events';

const initialState = {
  data: Immutable.Map(),
};

export default function eventsReducer(state = initialState, action) {
  switch(action.type){
    case EVENT_DELETED:
      return {
        ...state,
        data: state.data.delete( action.id ),
      }
    case EVENT_UPDATED:
    case EVENT_CREATED:
      return {
        ...state,
        data: state.data.set(action.event.get('_id'), action.event),
      }
    case EVENTS_LOADED:
      return {
        ...state,
        data: action.events
      }
    default: 
      return state;
  }
}
