'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = login;

var _formo = require('formo');

function login() {
  return new _formo.Formo([new _formo.Field('userName', {
    label: "User Name",
    type: "text",
    required: true
  }), new _formo.Field('password', {
    label: "Password",
    //type: "password",
    type: 'text',
    required: true
  })]);
}

module.exports = exports['default'];
//# sourceMappingURL=login.js.map
