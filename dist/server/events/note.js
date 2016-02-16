'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _models = require('../models');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

// TODO: not very efficiant, emit delete event even for already deleted notes
function entityDelete(event, registrations, emitter, entity, params) {
  _models.Note.findAll({ isDeleted: true, entityId: entity._id }, function (err, notes) {
    if (err) console.error(err);
    _lodash2['default'].each(notes, function (note) {
      return emitter('note.delete', note, registrations, params);
    });
  });
}

var conf = {
  'note.update': { rights: [''] },
  'note.new': { rights: ['admin'] },
  'note.delete': { rights: ['admin'] },
  'notes.entity.delete': {
    rights: ['admin'],
    callback: entityDelete
  }
};

exports['default'] = conf;
module.exports = exports['default'];
//# sourceMappingURL=note.js.map
