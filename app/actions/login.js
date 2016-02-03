import {requestJson} from '../utils';
import {routeActions} from './routes';
import routes from '../routes';
import uuid from 'uuid';
import Immutable from 'immutable';
import {alert} from './errors';
import {socketIOActions} from './socketIO';

//export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGOUT = 'USER_LOGOUT';

export function loggedIn(user, appJwt){
  const sessionId = uuid.v4();
  return {
    type: USER_LOGGED_IN,
    user: Immutable.fromJS(Maker(user)),
    appJwt,
    sessionId
  }
}

export function loginRequest(googleUser, nextRouteName){
  return (dispatch, getState) => {

    const id_token = googleUser.getAuthResponse().id_token;
    const body = { id_token};
    const message = 'Check your user parameters';
    const request = requestJson(`/login`, dispatch, getState, {verb: 'POST', body: body, header: 'Authentification Error', message: message});
    request.then( res => {
      localStorage.setItem('access_token', res.token);
      dispatch(loggedIn(Maker(res.user), res.token));
      dispatch(socketIOActions.login());
      console.log(nextRouteName)
      dispatch(routeActions.replace(nextRouteName || routes.defaultRoute));
    });
  }
}

export function logout(){
  return (dispatch, getState) => {
    localStorage.removeItem('access_token');
    const state = getState();
    dispatch({type: USER_LOGOUT});
    dispatch(socketIOActions.logout());
    dispatch(routeActions.push(routes.login));
  }
}

export const loginActions = { logout, loginRequest, loggedIn };

function Maker(user){
  user.name = [user.firstName, user.lastName].join(' ');
  return user;
}
