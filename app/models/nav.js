import _ from 'lodash';
import Reflux from 'reflux';
import routes from '../routes';
import errors from './errors';
import {loginStore} from './login';

const actions = Reflux.createActions([
  "enter", 
  "push", 
  "replace",
  "replaceRoute",
  "pushRoute",
  "goBack",
  "goBackRoute",
  "gotoLogin",
  "gotoUnAuth",
]);

const state = { 
  topic: undefined,
};

const history = [];

const store = Reflux.createStore({
  listenables: [actions],

  onEnter: function(route){
    state.topic = route.topic;
    this.trigger(state);
  },

  onReplace: function(nameOrRoute){
    if(!nameOrRoute) return actions.replaceRoute(routes.defaultRoute);
    const route = _.isString(nameOrRoute) ? routes.getRoute(nameOrRoute) : nameOrRoute;
    if(!route) errors.alert({header: "Client error", message: `Unknown route name: ${nameOrRoute}`});
    actions.replaceRoute(route);
  },

  onPush: function(nameOrRoute, context){
    if(!nameOrRoute) return actions.replaceRoute(routes.defaultRoute);
    const route = _.isString(nameOrRoute) ? routes[nameOrRoute] : nameOrRoute;
    if(!route) errors.alert({header: "Client error", message: `Unknown route name: ${nameOrRoute}`});
    history.push(context);
    console.log("history.level " + history.length);
    actions.pushRoute(route);
  },

  onGoBack: function(){
    history.pop();
    actions.goBackRoute(routes.login);
  },

  onGotoLogin(){
    actions.pushRoute(routes.login);
  },

  onGotoUnAuth(){
    actions.pushRoute(routes.unauthorized);
  },

  getContext(){
    return history[history.length-1] || {};
  },

});

export {store as navStore, actions as navActions};
