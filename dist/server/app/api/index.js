'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function init(mainApp, resources, params) {
  var app = (0, _express2['default'])();

  require('./companies').init(app, resources);
  require('./people').init(app, resources);
  require('./missions').init(app, resources);
  require('./workblocks').init(app, resources);
  require('./check_url').init(app, resources);
  require('./skills').init(app, resources);
  require('./cities').init(app, resources);
  require('./countries').init(app, resources);
  require('./tags').init(app, resources);
  require('./notes').init(app, resources);

  return app;
}
//# sourceMappingURL=index.js.map
