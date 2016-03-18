import {requestJson} from '../utils';
import Immutable from 'immutable';

export const CITIES_LOADED = 'CITIES_LOADED';

function citiesLoaded(cities){
  return{
    type: CITIES_LOADED,
    cities: Immutable.fromJS(cities),
  }
}

export function loadCities(){
  return (dispatch, getState) => {
    requestJson('/api/cities', {dispatch, message: 'Cannot load cities, check your backend server'})
      .then( cities => dispatch(citiesLoaded(cities)));
  }
}

export const citiesActions = { 
  load: loadCities,
}

