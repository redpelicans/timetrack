'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _containersPersonList = require('../containers/person/list');

var _containersPersonList2 = _interopRequireDefault(_containersPersonList);

var _containersPersonView = require('../containers/person/view');

var _containersPersonView2 = _interopRequireDefault(_containersPersonView);

var _containersPersonEdit = require('../containers/person/edit');

var _kontrolo = require('kontrolo');

var routes = (0, _kontrolo.RouteManager)([(0, _kontrolo.Route)({
  name: 'list',
  path: '/people',
  topic: 'people',
  label: 'People',
  component: _containersPersonList2['default'],
  isMenu: 2,
  iconName: 'users',
  authRequired: true
}), (0, _kontrolo.Route)({
  name: 'new',
  path: '/person/new',
  topic: 'people',
  component: _containersPersonEdit.NewPersonApp,
  authRoles: ['admin']
}), (0, _kontrolo.Route)({
  name: 'edit',
  path: '/person/edit',
  topic: 'people',
  component: _containersPersonEdit.EditPersonApp,
  authRoles: ['admin']
}), (0, _kontrolo.Route)({
  name: 'view',
  path: '/person/view',
  topic: 'people',
  component: _containersPersonView2['default']
})], { name: 'person' });

exports['default'] = routes;
module.exports = exports['default'];
//# sourceMappingURL=person.js.map
