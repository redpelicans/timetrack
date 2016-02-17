import _ from 'lodash'
import {createSelector} from 'reselect'

const missions = state => state.missions.data
const filterSelector = state => state.missions.filter
const sortCondSelector = state => state.missions.sortCond
const persons = state => state.persons.data
const companies = state => state.companies.data
const pendingRequests = state => state.pendingRequests

export const visibleMissionsSelector = createSelector(
  missions,
  filterSelector,
  sortCondSelector,
  persons,
  companies,
  pendingRequests,
  (missions, filter, sortCond, persons, companies, pendingRequests) => {
    return {
      missions: filterAndSort(missions, companies, filter, sortCond),
      filter,
      sortCond,
      persons,
      companies,
      isLoading: !!pendingRequests
    }
  }
)

function filterAndSort(missions, companies, filter, sortCond){
  return missions
    .toSetSeq()
    .filter(filterForSearch(filter, companies))
    .sort( (a,b) => sortByCond(a, b, sortCond.by, sortCond.order));
}

function sortByCond(a, b, attr, order){
  return order === 'asc' ? sortBy(a, b, attr) : sortBy(b, a, attr);
}

function sortBy(a, b, attr){
  if( a.get(attr) === b.get(attr) ) return attr !== 'name' ? sortByCond(a,b, 'name', 'desc') : 0;
  if(attr != 'name') return a.get(attr) < b.get(attr) ? 1 : -1;
  return a.get(attr) > b.get(attr) ? 1 : -1;
}

function filterForPreferred(filter){
  return p => filter ? p.get('preferred') : true;
}

function filterForSearch(filter='', companies){
  return  p => {
    const company = companies.get(p.get('clientId'));
    const name = [p.get('name'), company && company.get('name')].join( ' ') ;
    return name.toLowerCase().indexOf(filter) !== -1;
  }
}


