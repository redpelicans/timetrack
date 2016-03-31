import Immutable from 'immutable';
import {
  EVENTS_LOADED, 
} from '../actions/events';

const initialState = {
  data: Immutable.List(),
};

export default function eventsReducer(state = initialState, action) {
  switch(action.type){
    case EVENTS_LOADED:
      return {
        ...state,
        data: action.events
      }
    default: 
      return state;
  }
}
