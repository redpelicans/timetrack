'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

var _errors = require('./errors');

var _login = require('./login');

var actions = _reflux2['default'].createActions(["setContext", "enter", "push", "replace", "replaceRoute", "pushRoute", "goBack", "goBackRoute", "gotoLogin", "gotoUnAuth"]);

var state = {
  topic: undefined,
  context: undefined
};

var store = _reflux2['default'].createStore({
  listenables: [actions],

  onSetContext: function onSetContext(context) {
    state.context = context;
    this.trigger(state);
  },

  onEnter: function onEnter(route) {
    state.topic = route.topic;
    this.trigger(state);
  },

  onReplace: function onReplace(nameOrRoute) {
    if (!nameOrRoute) return actions.replaceRoute(_routes2['default'].defaultRoute);
    var route = _lodash2['default'].isString(nameOrRoute) ? _routes2['default'].getRoute(nameOrRoute) : nameOrRoute;
    if (!route) _errors.errorsActions.alert({ header: "Client error", message: 'Unknown route name: ' + nameOrRoute });
    actions.replaceRoute(route);
  },

  onPush: function onPush(nameOrRoute, context) {
    if (!nameOrRoute) return actions.replaceRoute(_routes2['default'].defaultRoute);
    var route = _lodash2['default'].isString(nameOrRoute) ? _routes2['default'][nameOrRoute] : nameOrRoute;
    if (!route) _errors.errorsActions.alert({ header: "Client error", message: 'Unknown route name: ' + nameOrRoute });
    state.context = context;
    actions.pushRoute(route, context);
    this.trigger(state);
  },

  onGoBack: function onGoBack() {
    actions.goBackRoute(_routes2['default'].login);
  },

  onGotoLogin: function onGotoLogin() {
    actions.pushRoute(_routes2['default'].login);
  },

  onGotoUnAuth: function onGotoUnAuth() {
    actions.pushRoute(_routes2['default'].unauthorized);
  }

});

exports.navStore = store;
exports.navActions = actions;
//# sourceMappingURL=nav.js.map
