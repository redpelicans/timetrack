'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = note;

var _formo = require('formo');

function note(document) {
  return new _formo.Formo([new _formo.Field('content', {
    type: "text"
  })], document);
}

module.exports = exports['default'];
//# sourceMappingURL=note.js.map
