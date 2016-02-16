// useful for monitoring
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _models = require('../models');

function init(app) {
  app.get('/health', function (req, res) {
    _models.Person.findAll({}, { limit: 1 }, function (err) {
      res.json({ health: !!!err });
    });
  });
}
//# sourceMappingURL=health.js.map
