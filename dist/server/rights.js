'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var rights = {
  'person.view': { roles: [] },
  'person.new': { roles: ['admin'] },
  'person.delete': { roles: ['admin'] },
  'person.update': { roles: ['admin'] },

  'company.view': { roles: [] },
  'company.new': { roles: ['admin'] },
  'company.delete': { roles: ['admin'] },
  'company.update': { roles: ['admin'] },

  'mission.view': { roles: [] },
  'mission.new': { roles: ['admin'] },
  'mission.delete': { roles: ['admin'] },
  'mission.update': { roles: ['admin'] }
};
exports['default'] = rights;
module.exports = exports['default'];
//# sourceMappingURL=rights.js.map
