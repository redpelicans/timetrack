'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createCompleted = createCompleted;
exports.deleteCompleted = deleteCompleted;
exports.updateCompleted = updateCompleted;
exports.createNote = createNote;
exports.deleteNote = deleteNote;
exports.updateNote = updateNote;
exports.loadNotes = loadNotes;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _utils = require('../utils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var NOTES_LOADED = 'NOTES_LOADED';
exports.NOTES_LOADED = NOTES_LOADED;
var NOTE_DELETED = 'NOTE_DELETED';
exports.NOTE_DELETED = NOTE_DELETED;
var NOTE_UPDATED = 'NOTE_UPDATED';
exports.NOTE_UPDATED = NOTE_UPDATED;
var NOTE_CREATED = 'NOTE_CREATED';

exports.NOTE_CREATED = NOTE_CREATED;

function createCompleted(note) {
  return {
    type: NOTE_CREATED,
    note: _immutable2['default'].fromJS(Maker(note))
  };
}

function deleteCompleted(note) {
  return {
    type: NOTE_DELETED,
    id: note._id
  };
}

function updateCompleted(previous, note) {
  return {
    type: NOTE_UPDATED,
    note: _immutable2['default'].fromJS(Maker(note))
  };
}

function createNote(note, entity) {
  return function (dispatch, getState) {
    note.entityId = entity._id;
    (0, _utils.requestJson)('/api/notes', dispatch, getState, { verb: 'post', body: { note: note }, message: 'Cannot create a note, check your backend server' }).then(function (note) {
      return dispatch(createCompleted(note));
    });
  };
}

function deleteNote(note) {
  return function (dispatch, getState) {
    (0, _utils.requestJson)('/api/note/' + note._id, dispatch, getState, { verb: 'delete', message: 'Cannot delete note, check your backend server' }).then(function (res) {
      return dispatch(deleteCompleted(note));
    });
  };
}

function updateNote(previous, updates) {
  return function (dispatch, getState) {
    var next = _extends({}, previous, updates);
    (0, _utils.requestJson)('/api/note', dispatch, getState, { verb: 'put', body: { note: next }, message: 'Cannot update note, check your backend server' }).then(function (note) {
      return dispatch(updateCompleted(previous, note));
    });
  };
}

function notesLoaded(notes) {
  return {
    type: NOTES_LOADED,
    notes: _immutable2['default'].fromJS(_.reduce(notes, function (res, p) {
      res[p._id] = Maker(p);return res;
    }, {}))
  };
}

function loadNotes() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$forceReload = _ref.forceReload;
  var forceReload = _ref$forceReload === undefined ? false : _ref$forceReload;
  var ids = _ref.ids;

  return function (dispatch, getState) {
    var state = getState();
    var objs = _.map(ids || [], function (id) {
      return state.notes.get(id);
    });
    var doRequest = forceReload || !_.every(objs) || !state.notes.size;

    if (!doRequest) return;

    (0, _utils.requestJson)('/api/notes', dispatch, getState, { message: 'Cannot load notes, check your backend server' }).then(function (notes) {
      return dispatch(notesLoaded(notes));
    });
  };
}

var notesActions = {
  load: loadNotes,
  create: createNote,
  update: updateNote,
  'delete': deleteNote,
  createCompleted: createCompleted,
  updateCompleted: updateCompleted,
  deleteCompleted: deleteCompleted
};

exports.notesActions = notesActions;
function Maker(obj) {
  obj.createdAt = (0, _moment2['default'])(obj.createdAt);
  if (obj.updatedAt) obj.updatedAt = (0, _moment2['default'])(obj.updatedAt);
  return obj;
}
//# sourceMappingURL=notes.js.map
