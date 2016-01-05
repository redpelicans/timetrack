'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var events = {
  'person.new': { roles: ['admin'] },
  'person.delete': { roles: ['admin'] },
  'person.update': { roles: ['admin'] },

  'company.new': { roles: ['admin'] },
  'company.delete': { roles: ['admin'] },
  'company.update': { roles: ['admin'] }
};

exports['default'] = events;
module.exports = exports['default'];
//# sourceMappingURL=events.js.map
