import Reflux from 'reflux';
import {requestJson} from '../utils';
import {navActions} from './nav';
import routes from '../sitemap';

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

  onLogin(user, nextRouteName){
    actions.loggedIn(user, 1);
    navActions.replace(nextRouteName);
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
    navActions.push(routes.defaultRoute);
  },

  isLoggedIn(){
    return !!state.user;
  }

});


export {store as loginStore, actions as loginActions};


