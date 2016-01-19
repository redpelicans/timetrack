import moment from 'moment';
import _ from 'lodash';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {companiesActions, companiesStore} from './companies';
import {personsActions, personsStore} from './persons';

const actions = Reflux.createActions([
  "load", 
  "filter", 
  "filterPreferred",
  "sort", 
  "togglePreferred",
]);

const state = {
  data: Immutable.List(),
  persons: Immutable.Map(),
  companies: Immutable.Map(),
  isLoading: false,
  filter: undefined,
  filterPreferred: false,
  sort: {
    by: 'name',
    order: 'asc' 
  }
}

const store = Reflux.createStore({

  listenables: [actions],

  getInitialState: function(){
    return state;
  },

  init: function(){
    // this.joinTrailing(companiesActions.loadCompleted, personsActions.loadCompleted, (res1, res2) => {
    //   console.log("personListAppStore loaded.")
    //   const companies = res1[0];
    //   const persons = res2[0];
    //   state.companies = companies;
    //   state.persons = persons;
    //   state.data = filterAndSort();
    //   this.trigger(state);
    // });

    companiesStore.listen( companies => {
      state.companies = companies.data;
      state.data = filterAndSort();
      this.trigger(state);
    });

    personsStore.listen( persons => {
      state.persons = persons.data;
      state.data = filterAndSort();
      state.isLoading = persons.isLoading;
      this.trigger(state);
    });
  },

  onLoad: function({forceReload=false, ids} = {}){
    state.persons = Immutable.Map();
    state.companies = Immutable.Map();
    this.trigger(state);
    personsActions.load({forceReload: forceReload, ids: ids});
    companiesActions.load({forceReload: forceReload});
  },

  onFilterPreferred(filter){
    state.filterPreferred = filter;
    state.data = filterAndSort();
    this.trigger(state);
  },

  onFilter: function(filter){
    state.filter = filter;
    state.data = filterAndSort();
    this.trigger(state);
  },

  onSort: function(by){
    if(state.sort.by === by) state.sort.order = {asc: 'desc', desc: 'asc'}[state.sort.order];
    state.sort.by = by;
    state.data = filterAndSort();
    this.trigger(state);
  },

})

function filterAndSort(){
  const {persons, filter, filterPreferred, sort} = state;
  return persons
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
  return a.get(attr) > b.get(attr) ? 1 : -1;
}

function filterForPreferred(filter){
  return p => filter ? p.get('preferred') : true;
}

function filterForSearch(filter=''){

  if(!filter) return p => p;

  function filterByName(p, key){
    const company = state.companies.get(p.get('companyId'));
    const name = [p.get('name').toLowerCase(), company && company.get('name').toLowerCase()].join( ' ') ;
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

  return  p => _.all(keys, filterMode(p));
}

const sortMenu = [
  {key: 'name', label: 'Sort Alphabeticaly'},
  {key: 'createdAt', label: 'Sort by creation date'},
  {key: 'updatedAt', label: 'Sort by updated date'},
];

export {sortMenu, store as personsAppStore, actions as personsAppActions};
