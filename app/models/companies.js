import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';

const actions = Reflux.createActions([
  "load", 
  "loadMany", 
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
  source: Immutable.Map(),
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
    const company =  state.source.get(id);
    return company;
  }
}

const store = Reflux.createStore({

  mixins: [Mixin],

  listenables: [actions],

  getInitialState: function(){
    return state;
  },

  onLoad: function({forceReload=false} = {}){
    // TODO: test to understand refresh ...
    state.companies = Immutable.fromJS([]);
    this.trigger(state);
    if(state.source.size && !forceReload){
      actions.loadCompleted(state.source);
    }else{;
      console.log("start loading companies ...")
      requestJson('/api/companies', {message: 'Cannot load companies, check your backend server'}).then( companies => {
          state.source = Immutable.fromJS(_.chain(companies).map( p => [p._id, Maker(p)]).object().value());
          console.log("end loading companies ...")
          actions.loadCompleted(state.source);
        });

      state.isLoading = true;
      this.trigger(state);
    }
  },

  onLoadMany: function(ids, {forceReload=false} = {}){
    // TODO: test to understand refresh ...
    state.companies = Immutable.fromJS([]);
    this.trigger(state);

    const companyIds = _.map(ids, id => state.source.get(id));
    if( _.all(companyIds) && !forceReload){
      actions.loadCompleted(state.source);
    }else{;
      console.log("start loading companies ...")
      requestJson('/api/companies', {message: 'Cannot load companies, check your backend server'}).then( companies => {
          state.source = Immutable.fromJS(_.chain(companies).map( p => [p._id, Maker(p)]).object().value());
          console.log("end loading companies ...")
          actions.loadCompleted(state.source);
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
        state.source = state.source.set(company._id, Immutable.fromJS(Maker(company)));
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
        state.source = state.source.set(company._id, Immutable.fromJS(Maker(company)));
        state.isLoading = false;
        state.companies = filterAndSort();
        this.trigger(state);
      });
  },

  onDelete(company){
    const id = company.get('_id');
    state.isLoading = true;
    this.trigger(state);
    requestJson(`/api/company/${id}`, {verb: 'delete', message: 'Cannot delete company, check your backend server'})
      .then( res => {
        state.source = state.source.delete( id );
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
      state.source = state.source.update(res._id, p =>  p.set('preferred', body.preferred) );
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
  const {source, filter, filterPreferred, sort} = state;
  return source
    .toSetSeq()
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


