import Immutable from 'immutable';
import moment from 'moment'

import {
  AGENDA_PERIOD_CHANGED, 
  AGENDA_FILTER_CHANGED, 
} from '../actions/agenda';

const initialMode = 'month';

const initialState = {
  viewMode: initialMode,
  defaultUnit: 'day',
  allowWeekends: false,
  from: moment().startOf(initialMode), 
  to: moment().endOf(initialMode),
  workerIds: [],
  missionIds: [],
};

export default function agendaReducer(state = initialState, action) {
  switch(action.type){
    case AGENDA_FILTER_CHANGED:
      return {
        ...state,
        missionIds: action.missionIds,
        workerIds: action.workerIds,
      }
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
