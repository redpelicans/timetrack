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

var baseSkills = ["AngularJS", "React", "D3", "Backbone", "Bootstrap", "JQuery", "KnockOut", "NodeJS", "MongoDB", "Docker"];

function init(app) {
  app.get('/skills', function (req, res, next) {
    _async2['default'].waterfall([load], function (err, skills) {
      if (err) return next(err);
      var hbaseSkills = _lodash2['default'].chain(baseSkills).map(function (skill) {
        return [skill, skill];
      }).object().value();
      var allSkills = _lodash2['default'].merge(hbaseSkills, skills);
      res.json(_lodash2['default'].values(allSkills).sort());
    });
  });
}

function load(cb) {
  _models.Person.findAll({ isDeleted: { $ne: true } }, { skills: 1 }, function (err, persons) {
    if (err) return next(err);
    var hallSkills = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = persons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var person = _step.value;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = (person.skills || [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var skill = _step2.value;

            hallSkills[skill] = skill;
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
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

    cb(null, hallSkills);
  });
}
//# sourceMappingURL=skills.js.map
