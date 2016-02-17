'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _kontrolo = require('kontrolo');

var _containersNotfound = require('../containers/notfound');

var _containersNotfound2 = _interopRequireDefault(_containersNotfound);

var _containersLogin = require('../containers/login');

var _containersLogin2 = _interopRequireDefault(_containersLogin);

var _componentsUnauthorized = require('../components/unauthorized');

var _componentsUnauthorized2 = _interopRequireDefault(_componentsUnauthorized);

var _person = require('./person');

var _person2 = _interopRequireDefault(_person);

var _company = require('./company');

var _company2 = _interopRequireDefault(_company);

var _mission = require('./mission');

var _mission2 = _interopRequireDefault(_mission);

var routes = (0, _kontrolo.RouteManager)([_person2['default'], _company2['default'], _mission2['default'], (0, _kontrolo.Route)({
  name: 'notfound',
  path: '/notfound',
  component: _containersNotfound2['default']
}), (0, _kontrolo.Route)({
  name: 'unauthorized',
  path: '/unauthorized',
  component: _componentsUnauthorized2['default']
}), (0, _kontrolo.Route)({
  name: 'login',
  path: '/login',
  component: _containersLogin2['default']
})]);

var TOTO = 1;
exports.TOTO = TOTO;
exports['default'] = routes;
//# sourceMappingURL=index.js.map
