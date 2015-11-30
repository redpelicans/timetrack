import Reflux from 'reflux';
import Immutable from 'immutable';
import _ from 'lodash';
import {requestJson} from '../utils';
import {navActions} from './nav';
import routes from '../routes';
import {personsStore} from './persons';


let appJwt;

const actions = Reflux.createActions([
  "login", 
  "loggedIn", 
  "logout", 
]);

const state = {
  user: undefined,
}


const store = Reflux.createStore({

  listenables: [actions],

  init(){
    personsStore.listen( persons => {
      if(state.user){
        const person = persons.data.get(state.user.get('_id'));
        if(person && person != state.user){
          state.user = person;
          this.trigger(state);
        }
      }
    });
  },

  onLogin(googleUser, nextRouteName){
    const token = googleUser.getAuthResponse().id_token;
    const body = { id_token: token};
    const message = 'Check your user parameters';
    const request = requestJson(`/login`, {verb: 'POST', body: body, header: 'Authentification Error', message: message});
    request.then( res => {
      actions.loggedIn(res.user, res.token);
      navActions.replace(nextRouteName);
    });
  },

  onLoggedIn(user, token){
    console.log("====> onLoggedIn")
    state.user = Immutable.fromJS(user);
    appJwt = token;
    localStorage.setItem('access_token', token);
    this.trigger(state);
  },

  onLogout(){
    localStorage.removeItem('access_token');
    state.user = undefined;
    this.trigger(state);
    navActions.push(routes.login);

    //const auth2 = gapi.auth2.getAuthInstance();
    // auth2.signOut().then(() => {
    //   this.trigger(state);
    //   navActions.push(routes.login);
    //   requestJson(`/logout`);
    // });
  },

  isLoggedIn(){
    return !!state.user;
  },

  getUser: function(){
    return state.user;
  },

  getUserRoles: function(){
    return state.user ? state.user.get('roles').toJS() : [];
  },

  isAuthorized(route){
    if(!route.isAuthRequired()) return true;
    if(!this.isLoggedIn()) return false;

    const roles = state.user.get('roles').toJS();
    return hasRoles(roles, 'admin') || hasRoles(roles, route.authRoles);
  },

  getJwt(){
    return appJwt;
  }

});


export {store as loginStore, actions as loginActions};

function hasRoles(roles, requiredRoles){
  return _.intersection(_.flatten([roles]), _.flatten([requiredRoles])).length;
}

