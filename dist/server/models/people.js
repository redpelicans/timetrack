'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _mongobless = require('mongobless');

var _mongobless2 = _interopRequireDefault(_mongobless);

var _njwt = require('njwt');

var _njwt2 = _interopRequireDefault(_njwt);

var Person = (function () {
  function Person() {
    _classCallCheck(this, _Person);
  }

  _createClass(Person, [{
    key: 'hasSomeRoles',
    value: function hasSomeRoles(roles) {
      return !_lodash2['default'].chain(roles).intersection(this.roles || []).isEmpty().value();
    }
  }, {
    key: 'hasAllRoles',
    value: function hasAllRoles(roles) {
      return _lodash2['default'].chain(roles).difference(this.roles || []).isEmpty().value();
    }
  }, {
    key: 'fullName',
    value: function fullName() {
      return [this.firstName, this.lastName].join(' ');
    }
  }], [{
    key: 'loadOne',
    value: function loadOne(id, cb) {
      Person.findOne({ isDeleted: { $ne: true }, _id: id }, function (err, user) {
        if (err) return cb(err);
        cb(null, user);
      });
    }
  }, {
    key: 'getFromToken',
    value: function getFromToken(token, secretKey, cb) {
      _njwt2['default'].verify(token, secretKey, function (err, token) {
        if (err) {
          console.log(err);
          if (err) return cb(err);
          return res.status(401).json({ message: "Wrong Token" });
        }

        Person.loadOne((0, _mongobless.ObjectId)(token.body.sub), function (err, user) {
          if (err) return cb(err);
          cb(null, user);
        });
      });
    }
  }]);

  var _Person = Person;
  Person = (0, _mongobless2['default'])({ collection: 'people' })(Person) || Person;
  return Person;
})();

exports['default'] = Person;
;
module.exports = exports['default'];
//# sourceMappingURL=people.js.map
