import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';

const actions = Reflux.createActions([
  "load", 
  "loadCompleted", 
  "create",
  "createCompleted", 
  "delete", 
  "deleteCompleted", 
  "update", 
  "updateCompleted", 
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

    console.log("start loading missions ...")
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/missions', {message: 'Cannot load missions, check your backend server'}).then( missions => {
      actions.loadCompleted.sync = true;
      actions.loadCompleted(Immutable.fromJS(_.chain(missions).map( p => [p._id, Maker(p)]).object().value()));
    });
  },

  onLoadCompleted: function(data){
    state.data = data;
    state.isLoading = false;
    this.trigger(state);
  },


  onCreate(mission){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/missions', {verb: 'post', body: {mission}, message: 'Cannot create mission, check your backend server'})
      .then( mission => {
        state.isLoading = false;
        actions.createCompleted.sync = true;
        actions.createCompleted(mission);
      });
  },

  onCreateCompleted(mission){
    state.data = state.data.set(mission._id,  Immutable.fromJS(Maker(mission)));
    this.trigger(state);
  },

  onUpdate(previous, updates){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/mission', {verb: 'put', body: {mission: _.assign(previous, updates)}, message: 'Cannot update mission, check your backend server'})
      .then( mission => {
        state.isLoading = false;
        actions.updateCompleted.sync = true;
        actions.updateCompleted(previous, mission);
      });
  },
  
  onUpdateCompleted(previous, mission){
    state.data = state.data.set(mission._id, Immutable.fromJS(Maker(mission)));
    this.trigger(state);
  },


  onDelete(mission){
    const id = mission._id;
    state.isLoading = true;
    this.trigger(state);
    requestJson(`/api/mission/${id}`, {verb: 'delete', message: 'Cannot delete mission, check your backend server'})
      .then( res => {
        state.isLoading = false;
        actions.deleteCompleted.sync = true;
        actions.deleteCompleted(mission);
      });
  },

  onDeleteCompleted(mission){
    state.data = state.data.delete( mission._id );
    this.trigger(state);
  },

});

function Maker(obj){
  obj.createdAt = moment(obj.createdAt || new Date(1967, 9, 1));
  obj.updatedAt = moment(obj.updatedAt || new Date(1967, 9, 1));
  if(obj.startDate)obj.startDate = moment(obj.startDate).toDate();
  if(obj.endDate)obj.endDate = moment(obj.endDate).toDate();
  return obj;
}

export {store as missionsStore, actions as missionsActions};


