import _ from 'lodash';
import Reflux from 'reflux';
import routes from '../sitemap';
import errors from './errors';

const actions = Reflux.createActions([
  "enter", 
  "push", 
  "replace",
  "replaceRoute",
  "pushRoute",
  "goBack",
  "gotoLogin",
]);

const state = { topic: undefined };

const store = Reflux.createStore({
  listenables: [actions],

  onEnter: function(route){
    state.topic = route.topic;
    this.trigger(state);
  },

  onReplace: function(nameOrRoute){
    if(!nameOrRoute) return actions.replaceRoute(routes.defaultRoute);
    const route = _.isString(nameOrRoute) ? routes[nameOrRoute] : nameOrRoute;
    if(!route) errors.alert({header: "Client error", message: `Unknown route name: ${nameOrRoute}`});
    actions.replaceRoute(route);
  },

  onPush: function(nameOrRoute){
    if(!nameOrRoute) return actions.replaceRoute(routes.defaultRoute);
    const route = _.isString(nameOrRoute) ? routes[nameOrRoute] : nameOrRoute;
    if(!route) errors.alert({header: "Client error", message: `Unknown route name: ${nameOrRoute}`});
    actions.pushRoute(route);
  },

  onGotoLogin(){
    actions.pushRoute(routes.login);
  },

});

export {store as navStore, actions as navActions};
