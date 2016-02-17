'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = tags;

var _formo = require('formo');

function tags(document) {
  return new _formo.Formo([new _formo.Field('tags', {
    label: "Tags",
    type: "text",
    defaultValue: [],
    checkDomainValue: false,
    multiValue: true
  })], document);
}

module.exports = exports['default'];
//# sourceMappingURL=tags.js.map
