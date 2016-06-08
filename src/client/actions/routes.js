import routes from '../routes';
import _ from 'lodash';
import {alert} from './errors';
import { routeActions as router} from 'react-router-redux'

import {browserHistory} from 'react-router';

export function replaceRoute(nameOrRoute){
  return dispatch => {
    if(!nameOrRoute) return router.replace(routes.defaultRoute.path);
    const route = _.isString(nameOrRoute) ? routes.getRoute(nameOrRoute) : nameOrRoute;
    if(!route) return dispatch(alert({header: "Client error", message: `Unknown route name: ${nameOrRoute}`}));
    dispatch(router.replace(route.path));
  }
}

export function pushRoute(nameOrRoute, context){
  return dispatch => {
    if(!nameOrRoute) return router.replace(routes.defaultRoute.path);
    const route = _.isString(nameOrRoute) ? routes.getRoute(nameOrRoute) : nameOrRoute;
    if(!route) return dispatch(alert({header: "Client error", message: `Unknown route name: ${nameOrRoute}`}));
    const path = context ? _.reduce(_.keys(context), (path, key) => {
      const re = new RegExp(`:${key}`)
      console.log(key)
      console.log(path)
      if(route.path.match(re)) return path.replace(re, context[key])
      return path
    }, route.path) : route.path
    dispatch(router.push({pathname: path, state: context}));
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

