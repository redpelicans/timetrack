'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mongobless = require('mongobless');

var _mongobless2 = _interopRequireDefault(_mongobless);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Preference = (function () {
  function Preference() {
    _classCallCheck(this, _Preference);
  }

  _createClass(Preference, null, [{
    key: 'spread',
    value: function spread(type, user, entities, cb) {
      Preference.findAll({ personId: user._id, type: type }, function (err, preferences) {
        if (err) return cb(err);
        var hpreferences = _lodash2['default'].reduce(preferences, function (res, p) {
          res[p.entityId] = true;return res;
        }, {});
        _lodash2['default'].each(entities, function (entity) {
          entity.preferred = !!hpreferences[entity._id];
        });
        cb(null, entities);
      });
    }
  }, {
    key: 'update',
    value: function update(type, user, isPreferred, entity, cb) {
      if (isPreferred) {
        Preference.collection.update({ personId: user._id, entityId: entity._id }, { personId: user._id, entityId: entity._id, type: type }, { upsert: true }, function (err) {
          return cb(err, entity);
        });
      } else {
        Preference.collection.deleteMany({ personId: user._id, entityId: entity._id }, function (err) {
          return cb(err, entity);
        });
      }
    }
  }, {
    key: 'delete',
    value: function _delete(user, id, cb) {
      Preference.collection.deleteMany({ personId: user._id, entityId: id }, function (err) {
        return cb(err, id);
      });
    }
  }]);

  var _Preference = Preference;
  Preference = (0, _mongobless2['default'])({ collection: 'preferences' })(Preference) || Preference;
  return Preference;
})();

exports['default'] = Preference;
;
module.exports = exports['default'];
//# sourceMappingURL=preferences.js.map
