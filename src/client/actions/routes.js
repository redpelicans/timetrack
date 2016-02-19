import routes from '../routes';
import { routeActions as router} from 'react-router-redux'

import {browserHistory} from 'react-router';

export function replaceRoute(nameOrRoute){
  return dispatch => {
    if(!nameOrRoute) return router.replace(routes.defaultRoute.path);
    const route = _.isString(nameOrRoute) ? routes.getRoute(nameOrRoute) : nameOrRoute;
    if(!route) errors.alert({header: "Client error", message: `Unknown route name: ${nameOrRoute}`});
    dispatch(router.replace(route.path));
  }
}

export function pushRoute(nameOrRoute, context){
  return dispatch => {
    console.log("pushRoute1")
    if(!nameOrRoute) return router.replace(routes.defaultRoute.path);
    console.log("pushRoute2")
    const route = _.isString(nameOrRoute) ? routes.getRoute(nameOrRoute) : nameOrRoute;
    console.log(route)
    if(!route) errors.alert({header: "Client error", message: `Unknown route name: ${nameOrRoute}`});
    dispatch(router.push({pathname: route.path, state: context}));
    //browserHistory.push({pathname: route.path, state: context});
  } 
}

export function gotoLogin(){
  return dispatch => {
    dispatch(pushRoute(routes.login));
  }
}

export function gotoUnAuth(){
  return dispatch => {
    dispatch(pushRoute(routes.unauthorized));
  }
}

export function goBack(){
  return dispatch => {
    dispatch(router.goBack());
  }
}

export const routeActions = {
    replace: replaceRoute
  , push: pushRoute
  , gotoUnAuth
  , gotoLogin
  , goBack
}
