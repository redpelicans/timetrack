'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = notesReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionsNotes = require('../actions/notes');

var initialState = _immutable2['default'].Map();

function notesReducer(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case _actionsNotes.NOTES_LOADED:
      return action.notes;
    case _actionsNotes.NOTE_DELETED:
      return state['delete'](action.id);
    case _actionsNotes.NOTE_UPDATED:
    case _actionsNotes.NOTE_CREATED:
      return state.set(action.note.get('_id'), action.note);
    default:
      return state;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=notes.js.map
