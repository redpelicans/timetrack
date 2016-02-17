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

var Note = (function () {
  function Note() {
    _classCallCheck(this, _Note);
  }

  _createClass(Note, null, [{
    key: 'loadOne',
    value: function loadOne(id, cb) {
      Note.findOne({ isDeleted: { $ne: true }, _id: id }, function (err, note) {
        if (err) return cb(err);
        cb(null, note);
      });
    }
  }, {
    key: 'create',
    value: function create(content, user, entity, cb) {
      if (!content) return setImmediate(cb, null, entity, null);
      var note = {
        entityId: entity._id,
        createdAt: new Date(),
        authorId: user._id,
        content: content
      };
      Note.collection.insertOne(note, function (err) {
        return cb(err, entity, note);
      });
    }
  }, {
    key: 'deleteForOneEntity',
    value: function deleteForOneEntity(id, cb) {
      Note.collection.updateMany({ entityId: id }, { $set: { updatedAt: new Date(), isDeleted: true } }, function (err) {
        return cb(err, id);
      });
    }
  }]);

  var _Note = Note;
  Note = (0, _mongobless2['default'])({ collection: 'notes' })(Note) || Note;
  return Note;
})();

exports['default'] = Note;
;
module.exports = exports['default'];
//# sourceMappingURL=notes.js.map
