'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _models = require('../../models');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('../../helpers');

function init(app) {
  app.get('/workblocks', function (req, res, next) {
    _models.Workblock.findAll(function (err, workblocks) {
      if (err) return next(err);
      res.json(workblocks);
    });
  });

  app.post('/workblocks', function (req, res, next) {
    var attrs = ['missionId', 'startTime', 'quantity', 'description'];
    _models.Workblock.collection.insert(fromJSON(req.body, attrs), function (err, result) {
      if (err) return next(err);
      res.json(_lodash2['default'].first(result.ops));
    });
  });

  app.put('/workblocks/:workblockId', function (req, res, next) {
    console.log(req.params.workblockId);
    _models.Workblock.collection.findAndModify({ _id: (0, _helpers.ObjectId)(req.params.workblockId) }, null, { $set: fromJSON(req.body, ['quantity', 'description']) }, function (err, result) {
      if (err) return next(err);
      res.json(result.value);
    });
  });
}

function fromJSON(data, attrs) {
  var workblock = _lodash2['default'].inject(attrs, function (memo, attr) {
    if (_lodash2['default'].has(data, attr)) memo[attr] = data[attr];
    return memo;
  }, {});
  if (!_lodash2['default'].has(workblock, 'unit')) workblock.unit = 'day';
  if (!_lodash2['default'].has(workblock, 'status')) workblock.unit = 'active';
  return workblock;
}
//# sourceMappingURL=workblocks.js.map
