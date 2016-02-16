'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _modelsErrors = require('../models/errors');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../utils');

var _nav = require('./nav');

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

var _persons = require('./persons');

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var actions = _reflux2['default'].createActions(["login", "loggedIn", "logout"]);

var state = {
  user: undefined,
  appJwt: undefined,
  sessionId: undefined };

// used to identify browser between http and ws
var store = _reflux2['default'].createStore({

  listenables: [actions],

  init: function init() {
    var _this = this;

    _persons.personsStore.listen(function (persons) {
      if (state.user) {
        var person = persons.data.get(state.user.get('_id'));
        if (person && person != state.user) {
          state.user = person;
          _this.trigger(state);
          var roles = person.get('roles').toJS();
          if (!(hasRoles(roles, 'access') || hasRoles(roles, 'admin'))) return actions.logout();
        }
      }
    });
  },

  onLogin: function onLogin(googleUser, nextRouteName) {
    var id_token = googleUser.getAuthResponse().id_token;
    var body = { id_token: id_token };
    var message = 'Check your user parameters';
    var request = (0, _utils.requestJson)('/login', { verb: 'POST', body: body, header: 'Authentification Error', message: message });
    request.then(function (res) {
      actions.loggedIn(res.user, res.token);
      _nav.navActions.replace(nextRouteName);
    });
  },

  onLoggedIn: function onLoggedIn(user, token) {
    state.user = _immutable2['default'].fromJS(user);
    state.appJwt = token;
    state.sessionId = _uuid2['default'].v4();
    localStorage.setItem('access_token', token);
    if (state.socket) socketIOLogin(state.socket, this.getJwt(), this.getSessionId());
    this.trigger(state);
  },

  onLogout: function onLogout() {
    localStorage.removeItem('access_token');
    state.user = undefined;
    if (state.socket) state.socket.emit('logout');
    this.trigger(state);
    _nav.navActions.push(_routes2['default'].login);
  },

  isLoggedIn: function isLoggedIn() {
    return !!state.user;
  },

  getUser: function getUser() {
    return state.user;
  },

  getUserRoles: function getUserRoles() {
    return state.user ? state.user.get('roles').toJS() : [];
  },

  isAuthorized: function isAuthorized(route) {
    if (!route.isAuthRequired()) return true;
    if (!this.isLoggedIn()) return false;

    var roles = state.user.get('roles').toJS();
    return hasRoles(roles, 'admin') || hasRoles(roles, 'access') && hasRoles(roles, route.authRoles);
  },

  getJwt: function getJwt() {
    return state.appJwt;
  },

  getSessionId: function getSessionId() {
    return state.sessionId;
  },

  setSocketIO: function setSocketIO(socket) {
    state.socket = socket;
    if (this.isLoggedIn()) socketIOLogin(socket, this.getJwt(), this.getSessionId());
  }

});

exports.loginStore = store;
exports.loginActions = actions;

function hasRoles(roles, requiredRoles) {
  return _lodash2['default'].intersection(_lodash2['default'].flatten([roles]), _lodash2['default'].flatten([requiredRoles])).length;
}

function socketIOLogin(socket, token, sessionId) {
  socket.emit('login', { token: token, sessionId: sessionId }, function (data) {
    if (data.status !== 'ok') _modelsErrors.errorsActions.alert({ header: 'Error', message: "Cannot subscribe to pushed events" });
  });
}
//# sourceMappingURL=login.js.map
