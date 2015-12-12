import _ from 'lodash';
import Reflux from 'reflux';
import routes from '../routes';
import errors from './errors';
import {loginStore} from './login';

const actions = Reflux.createActions([
  "setContext",
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
  context: undefined,
};


const store = Reflux.createStore({
  listenables: [actions],

  onSetContext: function(context){
    state.context = context;
    this.trigger(state);
  },

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
    state.context = context;
    actions.pushRoute(route, context);
    this.trigger(state);
  },

  onGoBack: function(){
    actions.goBackRoute(routes.login);
  },

  onGotoLogin(){
    actions.pushRoute(routes.login);
  },

  onGotoUnAuth(){
    actions.pushRoute(routes.unauthorized);
  },

});

export {store as navStore, actions as navActions};
