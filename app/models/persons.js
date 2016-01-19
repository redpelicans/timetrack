import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';
import {companiesActions} from './companies';
import {loginStore} from './login';

const actions = Reflux.createActions([
  "load", 
  "loadCompleted", 
  "togglePreferred", 
  "updateTags", 
  "delete", 
  "deleteCompleted", 
  "create", 
  "createCompleted", 
  "update", 
  "updateCompleted", 
]);

const state = {
  data: Immutable.Map(),
  isLoading: false,
}

const store = Reflux.createStore({

  listenables: [actions],

  getInitialState: function(){
    return state;
  },

  onLoad: function({forceReload=false, ids} = {}){
    const objs = _.map(ids || [], id => state.data.get(id));
    let doRequest = forceReload || !_.all(objs) || !state.data.size;

    if(!doRequest) return actions.loadCompleted(state.data);

    console.log("start loading persons ...")
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/people', {message: 'Cannot load people, check your backend server'}).then( people => {
      actions.loadCompleted.sync = true;
      actions.loadCompleted(Immutable.fromJS(_.chain(people).map( p => [p._id, Maker(p)]).object().value()));
    });
  },

  onLoadCompleted: function(data){
    state.data = data;
    state.isLoading = false;
    this.trigger(state);
  },

  onTogglePreferred(person){
    let body = { id: person.get('_id') , preferred: !person.get('preferred')};
    const message = 'Cannot toggle preferred status, check your backend server';
    let request = requestJson(`/api/people/preferred`, {verb: 'post', body: body, message: message});
    state.isLoading = true;
    this.trigger(state);

    request.then( res => {
      state.data = state.data.update(res._id, p =>  p.set('preferred', body.preferred) );
      state.isLoading = false;
      this.trigger(state);
    });
  },

  onUpdateTags(person, tags){
    let body = { entityId: person.get('_id') , tags, type: 'person'};
    const message = 'Cannot update tags, check your backend server';
    let request = requestJson(`/api/tags`, {verb: 'post', body: body, message: message});
    state.isLoading = true;
    this.trigger(state);

    request.then( person => {
      state.data = state.data.update(person._id, p =>  p.set('tags', person.tags) );
      state.isLoading = false;
      this.trigger(state);
    });
  },

  onCreate(person){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/people', {verb: 'post', body: {person: person}, message: 'Cannot create person, check your backend server'})
      .then( person => {
        state.isLoading = false;
        actions.createCompleted.sync = true;
        actions.createCompleted(person);
      });
  },

  onCreateCompleted(person){
    state.data = state.data.set(person._id,  Immutable.fromJS(Maker(person)));
    companiesActions.addPerson(person);
    this.trigger(state);
  },

  onUpdate(previous, updates){
    const next = _.assign({}, previous, updates);
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/person', {verb: 'put', body: {person: next}, message: 'Cannot update person, check your backend server'})
      .then( person => {
        state.isLoading = false;
        actions.updateCompleted.sync = true;
        actions.updateCompleted(previous, person);
      });
  },

  onUpdateCompleted(previous, person){
    state.data = state.data.set( person._id, Immutable.fromJS(Maker(person)) );
    if(previous.companyId !== person.companyId){
      companiesActions.removePerson(previous);
      companiesActions.addPerson(person);
    }
    this.trigger(state);
  },

  onDelete(person){
    const id = person._id;
    state.isLoading = true;
    this.trigger(state);
    requestJson(`/api/person/${id}`, {verb: 'delete', message: 'Cannot delete person, check your backend server'})
      .then( res => {
        state.isLoading = false;
        actions.deleteCompleted.sync = true;
        actions.deleteCompleted(person);
      });
  },

  onDeleteCompleted(person){
    state.data = state.data.delete( person._id );
    companiesActions.removePerson(person);
    this.trigger(state);
  },

});

function Maker(doc){
  doc.createdAt = moment(doc.createdAt);
  if(doc.updatedAt) doc.updatedAt = moment(doc.updatedAt);
  return doc;
}

export {store as personsStore, actions as personsActions};


