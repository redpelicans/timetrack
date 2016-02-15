import _ from 'lodash'
import {createSelector} from 'reselect';

const persons = state => state.persons.data
const companies = state => state.companies.data
const skills = state => state.skills
const userCompanyId = state => state.login.user.get('companyId')
const missions = state => state.missions.data
const filterSelector = state => state.persons.filter
const sortCondSelector = state => state.persons.sortCond
const preferredSelector = state => state.persons.filterPreferred
const pendingRequests = state => state.pendingRequests
const personId = state => state.routing.location.state && state.routing.location.state.personId
const companyId = state => state.routing.location.state && state.routing.location.state.companyId

const getFilterMissionById = id => mission =>  {
  const workers = mission.get('workerIds')
  return (mission.get('managerId') === id || (workers && workers.toJS().indexOf(id) !== -1))
}

export const newPersonSelector = createSelector(
  companyId,
  companies,
  skills,
  userCompanyId,
  (companyId, companies, skills, userCompanyId) => {
    return {
      userCompanyId,
      companyId,
      companies,
      skills
    }
  }
)

export const editPersonSelector = createSelector(
  personId,
  persons,
  companies,
  skills,
  userCompanyId,
  (personId, persons, companies, skills, userCompanyId) => {
    return {
      person: persons.get(personId),
      company: personId ? companies.get(persons.get(personId).get('companyId')) : null,
      companies,
      skills,
      userCompanyId
    }
  }
)

export const viewPersonSelector = createSelector(
  personId,
  companies,
  persons,
  missions,
  pendingRequests,
  (personId, companies, persons, missions, pendingRequests) => {
    return {
      person: persons.get(personId),
      company: personId ? companies.get(persons.get(personId).get('companyId')) : null,
      missions: missions.filter(getFilterMissionById(personId)),
      companies: companies,
      persons: persons,
      isLoading: !!pendingRequests
    }
  }
)

export const visiblePersonsSelector = createSelector(
  persons,
  companies,
  filterSelector,
  sortCondSelector,
  preferredSelector,
  pendingRequests,
  (persons, companies, filter, sortCond, filterPreferred, pendingRequests) => {
    return {
      persons: filterAndSort(persons, companies, filter, sortCond, filterPreferred),
      companies: companies,
      filter,
      sortCond,
      filterPreferred,
      isLoading: !!pendingRequests
    }
  }
)

function filterAndSort(persons, companies, filter, sort, filterPreferred){
  return persons
    .toSetSeq()
    .filter(filterForSearch(filter, companies))
    .filter(filterForPreferred(filterPreferred))
    .sort( (a,b) => sortByCond(a, b, sort.by, sort.order));
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

  if(!filter) return p => p;

  function filterByName(p, key){
    const company = companies.get(p.get('companyId'));
    const name = [
      p.get('name').toLowerCase(), 
      company && company.get('name').toLowerCase(), 
      p.get('email'),
    ].join( ' ') ;
    return name.indexOf(key) !== -1;
  }

  function filterByTag(p, key){
    const tags = _.chain(p.get('tags') && p.get('tags').toJS() || []).map(tag => tag.toLowerCase()).value().join(' ');
    const tag = key.slice(1);
    if(!tag) return true;
    return tags.indexOf(tag) !== -1;
  }

  function filterByRole(p, key){
    const roles = _.chain(p.get('roles') && p.get('roles').toJS() || []).map(role => role.toLowerCase()).value().join(' ');
    const role = key.slice(1);
    if(!role) return true;
    return roles.indexOf(role) !== -1;
  }

  function filterBySkills(p, key){
    const skills = _.chain(p.get('skills') && p.get('skills').toJS() || []).map(skill => skill.toLowerCase()).value().join(' ');
    const skill = key.slice(1);
    if(!skill) return true;
    return skills.indexOf(skill) !== -1;
  }

  function filterMode(p){
    return function(key){
      return ({
        '#': filterByTag,
        '!': filterByRole,
        '+': filterBySkills,
      }[key[0]] || filterByName)(p, key);
    }
  }

  const keys = _.chain(filter.split(' ')).compact().map(key => key.toLowerCase()).value();

  return  p => _.every(keys, filterMode(p));
}


