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
  persons: Immutable.fromJS([]),
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
    const person =  state.initialLoad.get(index);
    return person;
  }
}

const store = Reflux.createStore({

  mixins: [Mixin],

  listenables: [actions],

  getInitialState: function(){
    return state;
  },

  onLoad: function(forceReload){
    if(state.initialLoad.size && !forceReload){
        actions.loadCompleted();
    }else{;
      console.log("start loading persons ...")
      requestJson('/api/people', {message: 'Cannot load people, check your backend server'}).then( people => {
          state.initialLoad = Immutable.fromJS(_.map(people, p => PersonMaker(p)));
          console.log("end loading persons ...")
          actions.loadCompleted();
        });

      state.isLoading = true;
      this.trigger(state);
    }
  },

  onLoadCompleted: function(){
    state.persons = filterAndSortPersons();
    state.isLoading = false;
    this.trigger(state);
  },

  onCreate(person){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/people', {verb: 'post', body: {person: person}, message: 'Cannot create person, check your backend server'})
      .then( person => {
        state.initialLoad = state.initialLoad.push(Immutable.fromJS(PersonMaker(person)));
        state.persons = filterAndSortPersons();
        state.isLoading = false;
        this.trigger(state);
      });
  },

  onUpdate(previous, updates){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/person', {verb: 'put', body: {person: _.assign(previous, updates)}, message: 'Cannot update person, check your backend server'})
      .then( person => {
        const index = state.initialLoad.findIndex( p => p.get('_id') === person._id);
        state.initialLoad = state.initialLoad.delete(index).push(Immutable.fromJS(PersonMaker(person)));
        state.isLoading = false;
        this.trigger(state);
      });
  },

  onDelete(person){
    const id = person.get('_id');
    state.isLoading = true;
    this.trigger(state);
    requestJson(`/api/person/${id}`, {verb: 'delete', message: 'Cannot delete person, check your backend server'})
      .then( res => {
        const index = state.initialLoad.findIndex( p => p.get('_id') === id);
        state.initialLoad = state.initialLoad.delete( index );
        state.persons = filterAndSortPersons();
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
      const index = state.initialLoad.findIndex( p => p.get('_id') === res._id);
      state.initialLoad = state.initialLoad.update(index, p =>  p.set('preferred', body.preferred) );
      state.persons = filterAndSortPersons();
      state.isLoading = false;
      this.trigger(state);
    });
  },

  onFilterPreferred(filter){
    state.filterPreferred = filter;
    state.persons = filterAndSortPersons();
    this.trigger(state);
  },

  onFilter: function(filter){
    state.filter = filter;
    state.persons = filterAndSortPersons();
    this.trigger(state);
  },

  onSort: function(by){
    if(state.sort.by === by) state.sort.order = {asc: 'desc', desc: 'asc'}[state.sort.order];
    state.sort.by = by;
    state.persons = filterAndSortPersons();
    this.trigger(state);
  },
});

function filterAndSortPersons(){
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
  {key: 'createdAt', label: 'Sort by creation date'},
  {key: 'updatedAt', label: 'Sort by updated date'},
];

function PersonMaker(doc){
  doc.createdAt = moment(doc.createdAt || new Date(1967, 9, 1));
  doc.updatedAt = moment(doc.updatedAt || new Date(1967, 9, 1));
  return doc;
}

export {sortMenu, store as personsStore, actions as personsActions};


