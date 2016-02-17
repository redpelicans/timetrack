'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = registerAuthManager;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _kontrolo = require('kontrolo');

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

var _person = require('./person');

var _person2 = _interopRequireDefault(_person);

var _company = require('./company');

var _company2 = _interopRequireDefault(_company);

var _mission = require('./mission');

var _mission2 = _interopRequireDefault(_mission);

function registerAuthManager(store) {
  var user = undefined;

  store.subscribe(function () {
    var state = store.getState();
    user = state.login.user;
  });

  var loginStore = {
    isLoggedIn: function isLoggedIn() {
      return !!user;
    },

    getUserRoles: function getUserRoles() {
      return user ? user.get('roles').toJS() : [];
    },

    getUser: function getUser() {
      return user;
    }
  };

  return (0, _kontrolo.AuthManager)([_person2['default'], _company2['default'], _mission2['default']], { loginStore: loginStore });
}

module.exports = exports['default'];
//# sourceMappingURL=index.js.map
