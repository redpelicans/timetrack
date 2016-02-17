import Reflux from 'reflux';

const actions = Reflux.createActions([
  "alert"
]);



const store = Reflux.createStore({

  listenables: [actions],

  onAlert(error){
    this.trigger(error);
  },
});


export {store as errorsStore, actions as errorsActions};
