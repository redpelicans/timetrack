import Reflux from 'reflux';
import Immutable from 'immutable';
import {requestJson} from '../utils';

const actions = Reflux.createActions([
  "load", 
]);

const state = {
  data: Immutable.List(),
}

const store = Reflux.createStore({

  listenables: [actions],

  onLoad: function(){
    requestJson('/api/tags', {message: 'Cannot load tags, check your backend server'}).then( tags => {
      state.data = Immutable.fromJS(tags);
      this.trigger(state);
    });
  },

});

export {store as tagsStore, actions as tagsActions};


