import {createSelector} from 'reselect';
import _ from 'lodash';

const getStateSelector = state => () => state;
const companies = state => state.companies.data;
const missions = state => state.missions.data;
const persons = state => state.persons.data;
const filterSelector = state => state.companies.filter;
const sortCondSelector = state => state.companies.sortCond;
const preferredSelector = state => state.companies.filterPreferred;
const pendingRequests = state => state.pendingRequests;
const companyId = state => state.routing.location.state && state.routing.location.state.companyId;

const getFilterPersonsByCompanyId = companyId => person => person.get('companyId') === companyId

export const newCompanySelector = createSelector(
  getStateSelector,
  (getState) => {
    return {getState}
  }
)

export const editCompanySelector = createSelector(
  getStateSelector,
  companyId,
  companies,
  (getState, companyId, companies) => {
    return {
      getState,
      company: companies.get(companyId),
    }
  }
)

export const viewCompanySelector = createSelector(
  getStateSelector,
  companyId,
  companies,
  persons,
  missions,
  pendingRequests,
  (getState, companyId, companies, persons, missions, pendingRequests) => {
    return {
      getState,
      company: companies.get(companyId),
      isLoading: !!pendingRequests,
      persons,
      workers: persons.filter(getFilterPersonsByCompanyId(companyId)),
      missions: missions.filter(mission => mission.get("clientId") === companyId),
      companies
    }
  }
)

function filterCompanies(companies, filter, sortCond, filterPreferred){
  return companies.toSetSeq();
}

export const visibleCompaniesSelector = createSelector(
  companies,
  persons,
  filterSelector,
  sortCondSelector,
  preferredSelector,
  pendingRequests,
  (companies, persons, filter, sortCond, filterPreferred, pendingRequests) => {
    return {
      companies: filterAndSort(companies, filter, sortCond, filterPreferred),
      persons,
      isLoading: !!pendingRequests,
      filter,
      sortCond,
      filterPreferred
    }
  }
)


function filterAndSort(companies, filter, sort, filterPreferred){
  return companies
    .toSetSeq()
    .filter(filterForSearch(filter))
    .filter(filterForPreferred(filterPreferred))
    .sort( (a,b) => sortByCond(a, b, sort.by, sort.order));
}

function sortByCond(a, b, attr, order){
  return order === 'asc' ? sortBy(a, b, attr) : sortBy(b, a, attr);
}

function sortBy(a, b, attr){
  if( a.get(attr) === b.get(attr) ) return attr !== 'name' ? sortByCond(a,b, 'name', 'desc') : 0;
  if(attr != 'name') return a.get(attr) < b.get(attr) ? 1 : -1;
  return a.get(attr) >= b.get(attr) ? 1 : -1;
}

function filterForPreferred(filter){
  return p => filter ? p.get('preferred') : true;
}

function filterForSearch(filter=''){
  return  c => {
    const name = c.get('name') || '';
    return name.toLowerCase().indexOf(filter) !== -1;
  }
}

function filterForSearch(filter=''){
  function filterByName(key, name){
    return name.indexOf(key) !== -1;
  }

  function filterByTag(key, tags){
    const tag = key.slice(1);
    if(!tag) return true;
    return tags.indexOf(tag) !== -1;
  }

  const keys = _.chain(filter.split(' ')).compact().map(key => key.toLowerCase()).value();
  return  p => {
    const name = p.get('name').toLowerCase();
    const tags = _.chain(p.get('tags') && p.get('tags').toJS() || []).map(tag => tag.toLowerCase()).value().join(' ');
    return _.every(keys, key => key.startsWith('#') ? filterByTag(key, tags) : filterByName(key, name));
  }
}
