'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function init(mainApp, resources) {
  var app = (0, _express2['default'])();

  require('./clients').init(app, resources);

  return app;
}
//# sourceMappingURL=../../app/api/index.js.map