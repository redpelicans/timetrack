'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _actionsLogin = require('../actions/login');

function loginReducer(state, action) {
  if (state === undefined) state = {};

  switch (action.type) {
    case _actionsLogin.USER_LOGGED_IN:
      return {
        user: action.user,
        appJwt: action.appJwt,
        sessionId: action.sessionId
      };
    case _actionsLogin.USER_LOGOUT:
      return {};
    default:
      return state;
  }
}

exports['default'] = loginReducer;
module.exports = exports['default'];
//# sourceMappingURL=login.js.map
