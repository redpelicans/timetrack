'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _kontrolo = require('kontrolo');

exports['default'] = (0, _kontrolo.AuthManager)([(0, _kontrolo.Auth)({
  name: 'delete',
  roles: ['admin']
}), (0, _kontrolo.Auth)({
  name: 'togglePreferred',
  roles: ['admin']
}), (0, _kontrolo.Auth)({
  name: 'add',
  roles: ['admin']
})], { name: 'person' });
module.exports = exports['default'];
//# sourceMappingURL=person.js.map
