import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';
import {missionsActions, missionsStore} from './missions';
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
  missions: Immutable.Map(),
  persons: Immutable.Map(),
  companies: Immutable.Map(),
  data: Immutable.List(),
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

  init: function(){
    companiesStore.listen( companies => {
      state.companies = companies.data;
      state.data = filterAndSort();
      this.trigger(state);
    });

    personsStore.listen( persons => {
      state.persons = persons.data;
      state.data = filterAndSort();
      this.trigger(state);
    });

   missionsStore.listen( missions => {
      state.missions = missions.data;
      state.data = filterAndSort();
      state.isLoading = missions.isLoading;
      this.trigger(state);
    });
  },

  onLoad: function({forceReload=false, ids} = {}){
    state.missions = Immutable.Map();
    this.trigger(state);
    missionsActions.load({forceReload: forceReload, ids: ids});
    companiesActions.load({forceReload: forceReload});
    personsActions.load({forceReload: forceReload});
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

});

function filterAndSort(){
  const {missions, filter, filterPreferred, sort} = state;
  return missions
    .toSetSeq()
    .filter(filterForSearch(filter))
    //.filter(filterForPreferred(filterPreferred))
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
  return  p => {
    const company = state.companies.get(p.get('clientId'));
    const name = [p.get('name'), company && company.get('name')].join( ' ') ;
    return name.toLowerCase().indexOf(filter) !== -1;
  }
}

const sortMenu = [
  {key: 'name', label: 'Sort Alphabeticaly'},
  {key: 'createdAt', label: 'Sort by creation date'},
  {key: 'updatedAt', label: 'Sort by updated date'},
];

export {sortMenu, store as missionsAppStore, actions as missionsAppActions};
