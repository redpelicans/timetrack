import Reflux from 'reflux';
import {requestJson} from '../utils';
import {navActions} from './nav';

const actions = Reflux.createActions([
  "login", 
  "loggedIn", 
  "logout", 
]);

const state = {
  user: undefined,
  token: undefined,
}

const store = Reflux.createStore({

  listenables: [actions],

  onLogin(user, nextPath){
    console.log("==> login");
    actions.loggedIn(user, 1);
    navActions.replace(nextPath);
  },

  onLoggedIn(user, token ){
    state.user = user;
    state.token = token;
    this.trigger(state);
  },

  onLogout(){
    state.user = undefined;
    state.token = undefined;
    this.trigger(state);
  },

  isLoggedIn(){
    return !!state.user;
  }

});


export {store as loginStore, actions as loginActions};


