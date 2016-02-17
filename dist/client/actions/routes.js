'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.replaceRoute = replaceRoute;
exports.pushRoute = pushRoute;
exports.gotoLogin = gotoLogin;
exports.gotoUnAuth = gotoUnAuth;
exports.goBack = goBack;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

var _reactRouterRedux = require('react-router-redux');

var _reactRouter = require('react-router');

function replaceRoute(nameOrRoute) {
  return function (dispatch) {
    if (!nameOrRoute) return _reactRouterRedux.routeActions.replace(_routes2['default'].defaultRoute.path);
    var route = _.isString(nameOrRoute) ? _routes2['default'].getRoute(nameOrRoute) : nameOrRoute;
    if (!route) errors.alert({ header: "Client error", message: 'Unknown route name: ' + nameOrRoute });
    dispatch(_reactRouterRedux.routeActions.replace(route.path));
  };
}

function pushRoute(nameOrRoute, context) {
  return function (dispatch) {
    console.log("pushRoute1");
    if (!nameOrRoute) return _reactRouterRedux.routeActions.replace(_routes2['default'].defaultRoute.path);
    console.log("pushRoute2");
    var route = _.isString(nameOrRoute) ? _routes2['default'].getRoute(nameOrRoute) : nameOrRoute;
    console.log(route);
    if (!route) errors.alert({ header: "Client error", message: 'Unknown route name: ' + nameOrRoute });
    dispatch(_reactRouterRedux.routeActions.push({ pathname: route.path, state: context }));
    //browserHistory.push({pathname: route.path, state: context});
  };
}

function gotoLogin() {
  return function (dispatch) {
    dispatch(pushRoute(_routes2['default'].login));
  };
}

function gotoUnAuth() {
  return function (dispatch) {
    dispatch(pushRoute(_routes2['default'].unauthorized));
  };
}

function goBack() {
  return function (dispatch) {
    dispatch(_reactRouterRedux.routeActions.goBack());
  };
}

var routeActions = {
  replace: replaceRoute,
  push: pushRoute,
  gotoUnAuth: gotoUnAuth,
  gotoLogin: gotoLogin,
  goBack: goBack
};
exports.routeActions = routeActions;
//# sourceMappingURL=routes.js.map
