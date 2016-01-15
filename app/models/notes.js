import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';

const actions = Reflux.createActions([
  "load", 
  "loadCompleted", 
  "create", 
  "createCompleted", 
  "update", 
  "updateCompleted", 
  "delete", 
  "deleteCompleted", 
]);

const state = {
  data: Immutable.Map(),
  isLoading: false,
}

const store = Reflux.createStore({

  listenables: [actions],

  onLoad: function({forceReload=false, ids} = {}){
    const objs = _.map(ids || [], id => state.data.get(id));
    let doRequest = forceReload || !_.all(objs) || !state.data.size;

    if(!doRequest) return actions.loadCompleted(state.data);

    console.log("start loading notes ...")
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/notes', {message: 'Cannot load notes, check your backend server'}).then( notes => {
      actions.loadCompleted.sync = true;
      actions.loadCompleted(Immutable.fromJS(_.chain(notes).map( p => [p._id, Maker(p)]).object().value()));
    });
  },

  onLoadCompleted: function(data){
    state.data = data;
    state.isLoading = false;
    this.trigger(state);
  },

  onCreate(note, entity){
    note.entityId = entity._id;
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/notes', {verb: 'post', body: {note}, message: 'Cannot create a note, check your backend server'})
      .then( note => {
        state.isLoading = false;
        actions.createCompleted.sync = true;
        actions.createCompleted(note);
      });
  },

  onCreateCompleted(note){
    state.data = state.data.set(note._id, Immutable.fromJS(Maker(note)));
    this.trigger(state);
  },

  onUpdate(previous, updates){
    const next = _.assign({}, previous, updates);
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/note', {verb: 'put', body: {note: next}, message: 'Cannot update note, check your backend server'})
      .then( note => {
        state.isLoading = false;
        actions.updateCompleted.sync = true;
        actions.updateCompleted(previous, note);
      });
  },

  onUpdateCompleted(previous, note){
    state.data = state.data.set( note._id, Immutable.fromJS(Maker(note)) );
    this.trigger(state);
  },

  onDelete(note){
    const id = note._id;
    state.isLoading = true;
    this.trigger(state);
    requestJson(`/api/note/${id}`, {verb: 'delete', message: 'Cannot delete note, check your backend server'})
      .then( res => {
        state.isLoading = false;
        actions.deleteCompleted.sync = true;
        actions.deleteCompleted(note);
      });
  },

  onDeleteCompleted(note){
    state.data = state.data.delete( note._id );
    this.trigger(state);
  },

});

function Maker(obj){
  obj.createdAt = moment(obj.createdAt);
  if(obj.updatedAt) obj.updatedAt = moment(obj.updatedAt);
  return obj;
}

export {store as notesStore, actions as notesActions};


