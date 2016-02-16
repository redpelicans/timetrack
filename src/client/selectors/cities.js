import {createSelector} from 'reselect';

const cities = state => state.cities;

export const citiesSelector = createSelector(
  cities,
  cities => {
    return {
      cities: cities.map(city => {return {key: city, value: city}}).toJS(),
    }
  }
)
