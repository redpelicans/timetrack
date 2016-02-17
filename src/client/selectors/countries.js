import {createSelector} from 'reselect';

const countries = state => state.countries;

export const countriesSelector = createSelector(
  countries,
  countries => {
    return {
      countries: countries.map(country => {return {key: country, value: country}}).toJS(),
    }
  }
)
