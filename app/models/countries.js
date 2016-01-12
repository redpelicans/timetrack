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
    requestJson('/api/countries', {message: 'Cannot load countries, check your backend server'}).then( countries => {
      state.data = Immutable.fromJS(countries);
      this.trigger(state);
    });
  },

});

export {store as countriesStore, actions as countriesActions};


