import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';
import {loginStore} from './login';

const actions = Reflux.createActions([
  "load", 
  "loadCompleted", 
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

});

function Maker(doc){
  doc.createdAt = moment(doc.createdAt);
  doc.name = [doc.firstName, doc.lastName].join(' ');
  if(doc.updatedAt) doc.updatedAt = moment(doc.updatedAt);
  return doc;
}

export {store as personsStore, actions as personsActions};


