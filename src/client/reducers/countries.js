import Immutable from 'immutable';

import { COUNTRIES_LOADED } from '../actions/countries';

const initialState = Immutable.List();

export default function countriesReducer(state = initialState, action) {
  switch(action.type){
    case COUNTRIES_LOADED:
      return action.countries;
    default: 
      return state;
  }
}
