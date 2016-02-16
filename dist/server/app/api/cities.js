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

var basecities = ["Paris"];

function init(app) {
  app.get('/cities', function (req, res, next) {
    _async2['default'].waterfall([load], function (err, cities) {
      if (err) return next(err);
      //const hbasecities = _.chain(basecities).map( city => [city, city] ).object().value();
      var hbasecities = _lodash2['default'].reduce(basecities, function (res, city) {
        res[city] = city;return res;
      }, {});
      var allcities = _lodash2['default'].merge(hbasecities, cities);
      res.json(_lodash2['default'].values(allcities).sort());
    });
  });
}

function load(cb) {
  _models.Company.findAll({ isDeleted: { $ne: true }, 'address.city': { $exists: true } }, { 'address.city': 1 }, function (err, companies) {
    if (err) return next(err);
    var hallcities = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = companies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var company = _step.value;
        hallcities[company.address.city] = company.address.city;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    cb(null, hallcities);
  });
}
//# sourceMappingURL=cities.js.map
