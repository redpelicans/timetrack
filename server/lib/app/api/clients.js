'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _models = require('../../models');

function init(app) {
  app.get('/clients', function (req, res, next) {
    _async2['default'].waterfall([loadClients], function (err, clients) {
      res.json(clients);
    });
  });
}

function loadClients(cb) {
  _models.Client.findAll({ type: 'client' }, cb);
}
//# sourceMappingURL=../../app/api/clients.js.map