'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.loggedIn = loggedIn;
exports.loginRequest = loginRequest;
exports.logout = logout;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _routes = require('./routes');

var _routes2 = require('../routes');

var _routes3 = _interopRequireDefault(_routes2);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _errors = require('./errors');

var _socketIO = require('./socketIO');

//export const LOGIN_REQUEST = 'LOGIN_REQUEST';
var USER_LOGGED_IN = 'USER_LOGGED_IN';
exports.USER_LOGGED_IN = USER_LOGGED_IN;
var USER_LOGOUT = 'USER_LOGOUT';

exports.USER_LOGOUT = USER_LOGOUT;

function loggedIn(user, appJwt) {
  var sessionId = _uuid2['default'].v4();
  return {
    type: USER_LOGGED_IN,
    user: _immutable2['default'].fromJS(Maker(user)),
    appJwt: appJwt,
    sessionId: sessionId
  };
}

function loginRequest(googleUser, nextRouteName) {
  return function (dispatch, getState) {

    var id_token = googleUser.getAuthResponse().id_token;
    var body = { id_token: id_token };
    var message = 'Check your user parameters';
    var request = (0, _utils.requestJson)('/login', dispatch, getState, { verb: 'POST', body: body, header: 'Authentification Error', message: message });
    request.then(function (res) {
      localStorage.setItem('access_token', res.token);
      dispatch(loggedIn(Maker(res.user), res.token));
      dispatch(_socketIO.socketIOActions.login());
      //console.log(nextRouteName)
      dispatch(_routes.routeActions.replace(nextRouteName || _routes3['default'].defaultRoute));
    });
  };
}

function logout() {
  return function (dispatch, getState) {
    localStorage.removeItem('access_token');
    var state = getState();
    dispatch({ type: USER_LOGOUT });
    dispatch(_socketIO.socketIOActions.logout());
    dispatch(_routes.routeActions.push(_routes3['default'].login));
  };
}

var loginActions = { logout: logout, loginRequest: loginRequest, loggedIn: loggedIn };

exports.loginActions = loginActions;
function Maker(user) {
  user.name = [user.firstName, user.lastName].join(' ');
  return user;
}
//# sourceMappingURL=login.js.map
