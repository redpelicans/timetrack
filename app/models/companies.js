import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';

const actions = Reflux.createActions([
  "load", 
  "delete", 
  "create", 
  "update", 
  "loadCompleted", 
  "filter", 
  "filterPreferred",
  "sort", 
  "togglePreferred",
]);

const state = {
  companies: Immutable.fromJS([]),
  initialLoad: Immutable.fromJS([]),
  isLoading: false,
  filter: undefined,
  filterPreferred: false,
  sort: {
    by: 'name',
    order: 'asc' 
  }
}

const Mixin = {
  getById: function(id){
    const index = state.initialLoad.findIndex( p => p.get('_id') === id);
    const company =  state.initialLoad.get(index);
    return company;
  }
}

const store = Reflux.createStore({

  mixins: [Mixin],

  listenables: [actions],

  getInitialState: function(){
    return state;
  },

  onLoad: function(forceReload){
    // TODO: test to understand refresh ...
    state.companies = Immutable.fromJS([]);
    this.trigger(state);
    if(state.initialLoad.size && !forceReload){
      actions.loadCompleted();
    }else{;
      console.log("start loading companies ...")
      requestJson('/api/companies', {message: 'Cannot load companies, check your backend server'}).then( companies => {
          state.initialLoad = Immutable.fromJS(_.map(companies, p => Maker(p)));
          console.log("end loading companies ...")
          actions.loadCompleted();
        });

      state.isLoading = true;
      this.trigger(state);
    }
  },

  onLoadCompleted: function(){
    state.companies = filterAndSort();
    state.isLoading = false;
    this.trigger(state);
  },

  onCreate(company){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/companies', {verb: 'post', body: {company: company}, message: 'Cannot create company, check your backend server'})
      .then( company => {
        state.initialLoad = state.initialLoad.push(Immutable.fromJS(Maker(company)));
        state.companies = filterAndSort();
        state.isLoading = false;
        this.trigger(state);
      });
  },

  onUpdate(previous, updates){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/company', {verb: 'put', body: {company: _.assign(previous, updates)}, message: 'Cannot update company, check your backend server'})
      .then( company => {
        const index = state.initialLoad.findIndex( p => p.get('_id') === company._id);
        state.initialLoad = state.initialLoad.delete(index).push(Immutable.fromJS(Maker(company)));
        state.isLoading = false;
        this.trigger(state);
      });
  },

  onDelete(company){
    const id = company.get('_id');
    state.isLoading = true;
    this.trigger(state);
    requestJson(`/api/company/${id}`, {verb: 'delete', message: 'Cannot delete company, check your backend server'})
      .then( res => {
        const index = state.initialLoad.findIndex( p => p.get('_id') === id);
        state.initialLoad = state.initialLoad.delete( index );
        state.companies = filterAndSort();
        state.isLoading = false;
        this.trigger(state);
      });
  },

  onTogglePreferred(company){
    let body = { id: company.get('_id') , preferred: !company.get('preferred')};
    const message = 'Cannot toggle preferred status, check your backend server';
    let request = requestJson(`/api/companies/preferred`, {verb: 'post', body: body, message: message});
    state.isLoading = true;
    this.trigger(state);

    request.then( res => {
      const index = state.initialLoad.findIndex( p => p.get('_id') === res._id);
      state.initialLoad = state.initialLoad.update(index, p =>  p.set('preferred', body.preferred) );
      state.companies = filterAndSort();
      state.isLoading = false;
      this.trigger(state);
    });
  },

  onFilterPreferred(filter){
    state.filterPreferred = filter;
    state.companies = filterAndSort();
    this.trigger(state);
  },

  onFilter: function(filter){
    state.filter = filter;
    state.companies = filterAndSort();
    this.trigger(state);
  },

  onSort: function(by){
    if(state.sort.by === by) state.sort.order = {asc: 'desc', desc: 'asc'}[state.sort.order];
    state.sort.by = by;
    state.companies = filterAndSort();
    this.trigger(state);
  },
});

function filterAndSort(){
  const {initialLoad, filter, filterPreferred, sort} = state;
  return initialLoad
    .filter(filterForSearch(filter))
    .filter(filterForPreferred(filterPreferred))
    .sort( (a,b) => sortByCond(a, b, sort.by, sort.order));
}

function sortByCond(a, b, attr, order){
  return order === 'asc' ? sortBy(a, b, attr) : sortBy(b, a, attr);
}

function sortBy(a, b, attr){
  if( a.get(attr) === b.get(attr) ) return sortByCond(a,b, 'name', 'desc');
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

function Maker(doc){
  doc.createdAt = moment(doc.createdAt || new Date(1967, 9, 1));
  doc.updatedAt = moment(doc.updatedAt || new Date(1967, 9, 1));
  return doc;
}

export {sortMenu, store as companiesStore, actions as companiesActions};


