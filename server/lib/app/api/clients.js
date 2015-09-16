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

var _helpers = require('../../helpers');

function init(app) {
  app.get('/clients', function (req, res, next) {
    _async2['default'].waterfall([loadClients, computeBill], function (err, clients) {
      if (err) return next(err);
      res.json(clients);
    });
  });

  app.post('/clients/star', function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.body.id);
    _async2['default'].waterfall([loadClient.bind(null, id), star.bind(null, req.body.starred)], function (err, client) {
      if (err) return next(err);
      res.json(client);
    });
  });
}

function computeBill(clients, cb) {
  function setBillElements(client, cb) {
    if ((0, _helpers.getRandomInt)(0, 10) > 6) {
      client.billed = (0, _helpers.getRandomInt)(0, 50000);
      client.billable = (0, _helpers.getRandomInt)(5000, 75000);
    } else {
      client.billed = 0;
      client.billable = 0;
    }
    setImmediate(cb);
  }
  _async2['default'].map(clients, setBillElements, function (err) {
    return cb(err, clients);
  });
}

function loadClients(cb) {
  _models.Client.findAll({ type: 'client' }, cb);
}

function loadClient(id, cb) {
  _models.Client.findOne({ type: 'client', _id: id }, cb);
}

function star(starred, client, cb) {
  client.starred = ({ 'true': true, 'false': false })[starred] || false;
  _models.Client.collection.update({ _id: client._id }, { $set: { starred: client.starred } }, function (err) {
    cb(err, client);
  });
}
//# sourceMappingURL=../../app/api/clients.js.map