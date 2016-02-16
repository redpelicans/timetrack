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

var base = ["France"];

function init(app) {
  app.get('/countries', function (req, res, next) {
    _async2['default'].waterfall([load], function (err, countries) {
      if (err) return next(err);
      var hbasecountries = _lodash2['default'].reduce(base, function (res, country) {
        res[country] = country;return res;
      }, {});
      var allcountries = _lodash2['default'].merge(hbasecountries, countries);
      res.json(_lodash2['default'].values(allcountries).sort());
    });
  });
}

function load(cb) {
  _models.Company.findAll({ isDeleted: { $ne: true }, 'address.country': { $exists: true } }, { 'address.country': 1 }, function (err, companies) {
    if (err) return next(err);
    var hallcountries = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = companies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var company = _step.value;
        hallcountries[company.address.country] = company.address.country;
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

    cb(null, hallcountries);
  });
}
//# sourceMappingURL=countries.js.map
