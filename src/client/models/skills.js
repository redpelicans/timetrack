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
    if(state.data.size) return this.trigger(state);
    requestJson('/api/skills', {message: 'Cannot load skills, check your backend server'}).then( skills => {
      state.data = Immutable.fromJS(skills);
      this.trigger(state);
    });
  },

});

export {store as skillsStore, actions as skillsActions};


