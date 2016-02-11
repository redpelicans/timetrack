import {createSelector} from 'reselect';

const persons = state => state.persons.data;
const companies = state => state.companies.data;
const filterSelector = state => state.persons.filter;
const sortCondSelector = state => state.persons.sortCond;
const preferredSelector = state => state.persons.filterPreferred;
const pendingRequests = state => state.pendingRequests;
const personId = state => state.routing.location.state && state.routing.location.state.personId;

export const visiblePersonsSelector = createSelector(
  persons,
  companies,
  filterSelector,
  sortCondSelector,
  preferredSelector,
  pendingRequests,
  (persons, companies, filter, sortCond, filterPreferred, pendingRequests) => {
    return {
      persons: filterAndSort(persons, filter, sortCond, filterPreferred),
      companies: companies,
      filter,
      sortCond,
      filterPreferred,
      isLoading: !!pendingRequests
    }
  }
)


// Place this in utils and re-use it, copy-paste is bad.
function filterAndSort(entities, filter, sort, filterPreferred){
  return entities
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
