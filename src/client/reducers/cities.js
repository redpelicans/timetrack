import Immutable from 'immutable';

import { CITIES_LOADED } from '../actions/cities';

const initialState = Immutable.List();

export default function citiesReducer(state = initialState, action) {
  switch(action.type){
    case CITIES_LOADED:
      return action.cities;
    default: 
      return state;
  }
}
