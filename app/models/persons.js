import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';
import {companiesStore, companiesActions} from './companies';

const actions = Reflux.createActions([
  "load", 
  "loadMany", 
  "delete", 
  "create", 
  "update", 
  "loadPartial", 
  "loadCompleted", 
  "filter", 
  "filterPreferred",
  "sort", 
  "togglePreferred",
]);


const state = {
  source: Immutable.Map(),
  persons: Immutable.List(),
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
    const person =  state.source.get(id);
    return person;
  },
}

const store = Reflux.createStore({

  mixins: [Mixin],

  listenables: [actions],

  getInitialState: function(){
    return state;
  },

  init(){
    this.joinTrailing(companiesActions.loadCompleted, actions.loadPartial, (res1, res2) => {
      console.log("joinTrailing between persons and companies")
      const companies = res1[0];
      const people = res2[0];
      let source = Immutable.Map();
      _.each(people, person => {
        const p = Immutable.fromJS(Maker(person));
        source = source.set(person._id, updateCompany(p, companies));
      });
      actions.loadCompleted(source, companies);
    });
  },

  onLoad: function({forceReload=false, include=[]} = {}){
    const loadCompany = _.contains(include, 'company');
    if(loadCompany) companiesActions.load();
    if(state.source.size && !forceReload){
        actions.loadCompleted(state.source, state.companies);
    }else{
      console.log("start loading persons ...")
      state.isLoading = true;
      this.trigger(state);
      requestJson('/api/people', {message: 'Cannot load people, check your backend server'}).then( people => {
        console.log("end loading persons ...")
        if(loadCompany) actions.loadPartial( people );
        else actions.loadCompleted(Immutable.fromJS(_.chain(people).map( p => [p._id, Maker(p)]).object().value()));
      });
    }
  },

  onLoadMany: function(ids, {forceReload=false, include=[]} = {}){
    const loadCompany = _.contains(include, 'company');
    if(loadCompany) companiesActions.load();
    const personIds = _.map(ids, id => state.source.get(id));
    if( _.all(personIds) && !forceReload){
        actions.loadCompleted(state.source, state.companies);
    }else{
      // TODO: should load only person with ids
      console.log("start loading partial persons ...")
      state.isLoading = true;
      this.trigger(state);
      requestJson('/api/people', {message: 'Cannot load people, check your backend server'}).then( people => {
          console.log("end loading persons ...")
          if(loadCompany) actions.loadPartial( people );
          else actions.loadCompleted(Immutable.fromJS(_.chain(people).map( p => [p._id, Maker(p)]).object().value()));
        });
    }
  },


  onLoadCompleted: function(source, companies){
    state.source = source;
    if(companies) state.companies = companies;
    state.persons = filterAndSort();
    state.isLoading = false;
    this.trigger(state);
  },

  onCreate(person){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/people', {verb: 'post', body: {person: person}, message: 'Cannot create person, check your backend server'})
      .then( person => {
        state.source = state.source.set(person._id,  updateCompany(
          Immutable.fromJS(Maker(person)),
          state.companies
        ));
        state.persons = filterAndSort();
        state.isLoading = false;
        this.trigger(state);
      });
  },

  onUpdate(previous, updates){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/person', {verb: 'put', body: {person: _.assign(previous, updates)}, message: 'Cannot update person, check your backend server'})
      .then( person => {
        state.source = state.source.set( 
          person._id, 
          updateCompany(
            Immutable.fromJS(Maker(person)),
            state.companies
          )
        );
        state.isLoading = false;
        state.persons = filterAndSort();
        this.trigger(state);
      });
  },

  onDelete(person){
    const id = person.get('_id');
    state.isLoading = true;
    this.trigger(state);
    requestJson(`/api/person/${id}`, {verb: 'delete', message: 'Cannot delete person, check your backend server'})
      .then( res => {
        state.source = state.source.delete( id );
        state.persons = filterAndSort();
        state.isLoading = false;
        this.trigger(state);
      });
  },

  onTogglePreferred(person){
    let body = { id: person.get('_id') , preferred: !person.get('preferred')};
    const message = 'Cannot toggle preferred status, check your backend server';
    let request = requestJson(`/api/people/preferred`, {verb: 'post', body: body, message: message});
    state.isLoading = true;
    this.trigger(state);

    request.then( res => {
      state.source = state.source.update(res._id, p =>  p.set('preferred', body.preferred) );
      state.persons = filterAndSort();
      state.isLoading = false;
      this.trigger(state);
    });
  },

  onFilterPreferred(filter){
    state.filterPreferred = filter;
    state.persons = filterAndSort();
    this.trigger(state);
  },

  onFilter: function(filter){
    state.filter = filter;
    state.persons = filterAndSort();
    this.trigger(state);
  },

  onSort: function(by){
    if(state.sort.by === by) state.sort.order = {asc: 'desc', desc: 'asc'}[state.sort.order];
    state.sort.by = by;
    state.persons = filterAndSort();
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
    const name = [c.get('name'), c.getIn(['company', 'name'])].join(" ");
    return name.toLowerCase().indexOf(filter) !== -1;
  }
}

// TODO: add company
const sortMenu = [
  {key: 'name', label: 'Sort Alphabeticaly'},
  {key: 'createdAt', label: 'Sort by creation date'},
  {key: 'updatedAt', label: 'Sort by updated date'},
];

function Maker(doc){
  doc.createdAt = moment(doc.createdAt || new Date(1967, 9, 1));
  doc.updatedAt = moment(doc.updatedAt || new Date(1967, 9, 1));
  return doc;
}

function updateCompany(person, companies){
  if(!person.get('companyId')) return person;
  return person.set('company', companies.get(person.get('companyId')));
}

export {sortMenu, store as personsStore, actions as personsActions};


