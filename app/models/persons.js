import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import errors from '../models/errors';
import {requestJson, errorMgt} from '../utils';

const actions = Reflux.createActions([
  "load", 
  "loadCompleted", 
  "filter", 
  "filterPreferred",
  "sort", 
  "togglePreferred",
]);


const state = {
  persons: Immutable.fromJS([]),
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

  onLoad: function(){
    console.log("start loading persons ...")
    requestJson('/api/people').then( people => {
        console.log("end loading persons ...")
        actions.loadCompleted(_.map(people, p => PersonMaker(p)));
      })
      .catch( err => {
        console.error(err.toString());
        errors.alert({
          header: 'Runtime Error',
          message: 'Cannot load people, check your backend server'
        });
      });

    state.isLoading = true;
    this.trigger(state);
  },

  onLoadCompleted: function(people){
    state.initialLoad = Immutable.fromJS(people);
    state.persons = filterAndSortPersons();
    state.isLoading = false;
    this.trigger(state);
  },

  onTogglePreferred(person){
    let body = { id: person.get('_id') , preferred: !person.get('preferred')};
    let request = requestJson(`/api/people/preferred`, 'post', body);

    request.then( res => {
      const index = state.initialLoad.findIndex( p => p.get('_id') === res._id);
      state.initialLoad = state.initialLoad.update(index, p =>  p.set('preferred', body.preferred) );
      state.persons = filterAndSortPersons();
      this.trigger(state);
    }).catch( err => {
        console.error(err.toString());
        errors.alert({
          header: 'Runtime Error',
          message: 'Cannot toggle preferred status, check your backend server'
        });
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
  if( a.get(attr) === b.get(attr) ) return sort(a,b, 'name', 'desc');
  return a.get(attr) >= b.get(attr) ? 1 : -1;
}

function filterForPreferred(filter){
  return  p => p.get('preferred') === filter 
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
  if(doc.updatedAt) doc.updatedAt = moment(doc.updatedAt);
  return doc;
}

export {sortMenu, store as personsStore, actions as personsActions};


