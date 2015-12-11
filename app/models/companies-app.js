import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';
import {personsActions, personsStore} from './persons';
import {companiesActions, companiesStore} from './companies';

const actions = Reflux.createActions([
  "load", 
  "delete", 
  "create", 
  "update", 
  "loadCompleted", 
  "filter", 
  "filterPreferred",
  "sort", 
]);

const state = {
  companies: Immutable.Map(),
  persons: Immutable.Map(),
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

  getInitialState: function(){
    return state;
  },

  init: function(){
    // this.joinTrailing(companiesActions.loadCompleted, personsActions.loadCompleted, (res1, res2) => {
    //   console.log("companiesAppStore loaded.")
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
      state.isLoading = companies.isLoading;
      this.trigger(state);
    });
  },

  onLoad: function({forceReload=false, ids} = {}){
    companiesActions.load({forceReload: forceReload, ids: ids});
    personsActions.load();
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
  const {companies, filter, filterPreferred, sort} = state;
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

// TODO: add company
function filterForSearch(filter=''){
  return  c => {
    const name = c.get('name') || '';
    return name.toLowerCase().indexOf(filter) !== -1;
  }
}

// TODO: add company
const sortMenu = [
  {key: 'name', label: 'Sort Alphabeticaly'},
  {key: 'billable', label: 'Sort by billable amount'},
  {key: 'billed', label: 'Sort by billed amount'},
  {key: 'createdAt', label: 'Sort by creation date'},
  {key: 'updatedAt', label: 'Sort by updated date'},
];

export {sortMenu, store as companiesAppStore, actions as companiesAppActions};


