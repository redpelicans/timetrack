import Reflux from 'reflux';
import errors from '../models/errors';
import Immutable from 'immutable';
import _ from 'lodash';
import {requestJson} from '../utils';
import {navActions} from './nav';
import routes from '../routes';
import {personsStore} from './persons';
import uuid from 'uuid';


const actions = Reflux.createActions([
  "login", 
  "loggedIn", 
  "logout", 
]);

const state = {
  user: undefined,
  appJwt: undefined,
  sessionId: undefined, // used to identify browser between http and ws
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
    const id_token = googleUser.getAuthResponse().id_token;
    const body = { id_token};
    const message = 'Check your user parameters';
    const request = requestJson(`/login`, {verb: 'POST', body: body, header: 'Authentification Error', message: message});
    request.then( res => {
      actions.loggedIn(res.user, res.token);
      navActions.replace(nextRouteName);
    });
  },

  onLoggedIn(user, token){
    state.user = Immutable.fromJS(user);
    state.appJwt = token;
    state.sessionId = uuid.v4();
    localStorage.setItem('access_token', token);
    if(state.socket) socketIOLogin(state.socket, this.getJwt(), this.getSessionId());
    this.trigger(state);
  },

  onLogout(){
    localStorage.removeItem('access_token');
    state.user = undefined;
    if(state.socket) state.socket.emit('logout');
    this.trigger(state);
    navActions.push(routes.login);
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
    return state.appJwt;
  },

  getSessionId(){
    return state.sessionId;
  },

  setSocketIO(socket){
    state.socket = socket;
    if(this.isLoggedIn()) socketIOLogin(socket, this.getJwt(), this.getSessionId());
  },

});

export {store as loginStore, actions as loginActions};

function hasRoles(roles, requiredRoles){
  return _.intersection(_.flatten([roles]), _.flatten([requiredRoles])).length;
}

function socketIOLogin(socket, token, sessionId){
  socket.emit('login', {token, sessionId}, data => {
    if(data.status !== 'ok') errors.alert({ header: 'Error', message: "Cannot subscribe to pushed events" });
  });
}

