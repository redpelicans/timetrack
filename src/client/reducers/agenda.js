import Immutable from 'immutable';
import moment from 'moment'

import {
  AGENDA_PERIOD_CHANGED, 
} from '../actions/agenda';

const initialMode = 'month';

const initialState = {
  viewMode: initialMode,
  defaultUnit: 'day',
  allowWeekends: false,
  from: moment().startOf(initialMode), 
  to: moment().endOf(initialMode),
  persons: undefined,
  missions: undefined,
};

export default function agendaReducer(state = initialState, action) {
  switch(action.type){
    case AGENDA_PERIOD_CHANGED:
      return {
        ...state,
        from: action.from,
        to: action.to,
      }
    default: 
      return state;
  }
}
