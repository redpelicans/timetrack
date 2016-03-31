import Immutable from 'immutable';
import moment from 'moment'

const initialState = {
  from: moment().startOf('month'), 
  to: moment().endOf('month'),
  persons: undefined,
  missions: undefined,
};

export default function agendaReducer(state = initialState, action) {
  switch(action.type){
    default: 
      return state;
  }
}
