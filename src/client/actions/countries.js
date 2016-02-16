import {requestJson} from '../utils';
import Immutable from 'immutable';

export const COUNTRIES_LOADED = 'COUNTRIES_LOADED';

function countriesLoaded(countries){
  return{
    type: COUNTRIES_LOADED,
    countries: Immutable.fromJS(countries),
  }
}

export function loadCountries(){
  return (dispatch, getState) => {
    requestJson('/api/countries', dispatch, getState, {message: 'Cannot load countries, check your backend server'})
      .then( countries => dispatch(countriesLoaded(countries)));
  }
}

export const countriesActions = { 
  load: loadCountries,
}

