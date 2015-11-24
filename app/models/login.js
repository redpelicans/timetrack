import Reflux from 'reflux';
import Immutable from 'immutable';
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
}


const store = Reflux.createStore({

  //mixins: [Mixin],

  listenables: [actions],

  onLogin(googleUser, nextRouteName){
    console.log("====> onLogin")
    const token = googleUser.getAuthResponse().id_token;
    const body = { id_token: token};
    const message = 'Check your user parameters';
    const request = requestJson(`/login`, {verb: 'POST', body: body, header: 'Authentification Error', message: message});
    request.then( res => {
      actions.loggedIn(res.user);
      navActions.replace(nextRouteName);
    });
  },

  onLoggedIn(user, ){
    state.user = Immutable.fromJS(user);
    this.trigger(state);
  },

  onLogout(){
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log('User signed out.');
      state.user = undefined;
      this.trigger(state);
      navActions.push(routes.login);
    });
  },

  isLoggedIn(){
    return !!state.user;
  }

});


export {store as loginStore, actions as loginActions};


