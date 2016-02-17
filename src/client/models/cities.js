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
    //if(state.data.size) return this.trigger(state);
    requestJson('/api/cities', {message: 'Cannot load cities, check your backend server'}).then( cities => {
      state.data = Immutable.fromJS(cities);
      this.trigger(state);
    });
  },

});

export {store as citiesStore, actions as citiesActions};


