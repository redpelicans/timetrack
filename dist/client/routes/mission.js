'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _viewsMissionList = require('../views/mission/list');

var _viewsMissionList2 = _interopRequireDefault(_viewsMissionList);

var _viewsMissionEdit = require('../views/mission/edit');

var _viewsMissionView = require('../views/mission/view');

var _viewsMissionView2 = _interopRequireDefault(_viewsMissionView);

var _kontrolo = require('kontrolo');

var routes = (0, _kontrolo.RouteManager)([(0, _kontrolo.Route)({
  name: 'list',
  path: '/missions',
  topic: 'missions',
  label: 'Missions',
  component: _viewsMissionList2['default'],
  isMenu: 3,
  iconName: 'shopping-cart',
  authRequired: true
}), (0, _kontrolo.Route)({
  name: 'new',
  path: '/mission/new',
  topic: 'missions',
  component: _viewsMissionEdit.NewMissionApp,
  authRoles: ['admin']
}), (0, _kontrolo.Route)({
  name: 'edit',
  path: '/mission/edit',
  topic: 'missions',
  component: _viewsMissionEdit.EditMissionApp,
  authRoles: ['admin'],
  authMethod: function authMethod(user) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var mission = _ref.mission;

    if (!mission) return true;
    return mission.get('status') !== 'closed';
  }
}), (0, _kontrolo.Route)({
  name: 'view',
  path: '/mission/view',
  topic: 'missions',
  component: _viewsMissionView2['default']
})], { name: 'mission' });

exports['default'] = routes;
module.exports = exports['default'];
//# sourceMappingURL=mission.js.map
