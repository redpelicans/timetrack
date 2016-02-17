'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _kontrolo = require('kontrolo');

exports['default'] = (0, _kontrolo.AuthManager)([(0, _kontrolo.Auth)({
  name: 'delete',
  roles: ['admin'],
  method: function method(user, context) {
    if (!context.company) return false;
    return !context.company.get('personIds').size;
  }
}), (0, _kontrolo.Auth)({
  name: 'togglePreferred',
  roles: ['admin']
}), (0, _kontrolo.Auth)({
  name: 'leave',
  roles: ['admin']
}), (0, _kontrolo.Auth)({
  name: 'add',
  roles: ['admin']
})], { name: 'company' });
module.exports = exports['default'];
//# sourceMappingURL=company.js.map
