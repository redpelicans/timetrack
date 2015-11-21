import Reflux from 'reflux';

const actions = Reflux.createActions(["register", "replace"]);

const state = { topic: undefined };

const store = Reflux.createStore({
  listenables: [actions],

  onRegister: function(route){
    state.topic = route.topic;
    this.trigger(state);
  }
});

export {store as navStore, actions as navActions};
