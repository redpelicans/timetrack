'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _kontrolo = require('kontrolo');

exports['default'] = (0, _kontrolo.AuthManager)([(0, _kontrolo.Auth)({
  name: 'delete',
  roles: ['admin'],
  method: function method(user, _ref) {
    var mission = _ref.mission;

    if (!mission) return false;
    return mission.get('status') !== 'closed';
  }
}), (0, _kontrolo.Auth)({
  name: 'close',
  roles: ['admin']
}), (0, _kontrolo.Auth)({
  name: 'add',
  roles: ['admin']
})], { name: 'mission' });
module.exports = exports['default'];
//# sourceMappingURL=mission.js.map
