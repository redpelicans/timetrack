'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _containersCompanyList = require('../containers/company/list');

var _containersCompanyList2 = _interopRequireDefault(_containersCompanyList);

var _containersCompanyView = require('../containers/company/view');

var _containersCompanyView2 = _interopRequireDefault(_containersCompanyView);

var _containersCompanyEdit = require('../containers/company/edit');

var _kontrolo = require('kontrolo');

var routes = (0, _kontrolo.RouteManager)([(0, _kontrolo.Route)({
  name: 'list',
  path: '/companies',
  defaultRoute: true,
  topic: 'companies',
  label: 'Companies',
  component: _containersCompanyList2['default'],
  isMenu: 1,
  iconName: 'building',
  authRequired: true
}), (0, _kontrolo.Route)({
  name: 'new',
  path: '/company/new',
  topic: 'companies',
  component: _containersCompanyEdit.NewCompanyApp,
  authRoles: ['admin']
}), (0, _kontrolo.Route)({
  name: 'edit',
  path: '/company/edit',
  topic: 'companies',
  component: _containersCompanyEdit.EditCompanyApp,
  authRoles: ['admin']
}), (0, _kontrolo.Route)({
  name: 'view',
  path: '/company/view',
  topic: 'companies',
  component: _containersCompanyView2['default'],
  authRequired: true
})], { name: 'company' });

exports['default'] = routes;
module.exports = exports['default'];
//# sourceMappingURL=company.js.map
