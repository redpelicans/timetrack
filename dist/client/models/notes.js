'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _utils = require('../utils');

var actions = _reflux2['default'].createActions(["load", "loadCompleted", "create", "createCompleted", "update", "updateCompleted", "delete", "deleteCompleted"]);

var state = {
  data: _immutable2['default'].Map(),
  isLoading: false
};

var store = _reflux2['default'].createStore({

  listenables: [actions],

  onLoad: function onLoad() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$forceReload = _ref.forceReload;
    var forceReload = _ref$forceReload === undefined ? false : _ref$forceReload;
    var ids = _ref.ids;

    var objs = _.map(ids || [], function (id) {
      return state.data.get(id);
    });
    var doRequest = forceReload || !_.all(objs) || !state.data.size;

    if (!doRequest) return actions.loadCompleted(state.data);

    console.log("start loading notes ...");
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/notes', { message: 'Cannot load notes, check your backend server' }).then(function (notes) {
      actions.loadCompleted.sync = true;
      actions.loadCompleted(_immutable2['default'].fromJS(_.chain(notes).map(function (p) {
        return [p._id, Maker(p)];
      }).object().value()));
    });
  },

  onLoadCompleted: function onLoadCompleted(data) {
    state.data = data;
    state.isLoading = false;
    this.trigger(state);
  },

  onCreate: function onCreate(note, entity) {
    note.entityId = entity._id;
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/notes', { verb: 'post', body: { note: note }, message: 'Cannot create a note, check your backend server' }).then(function (note) {
      state.isLoading = false;
      actions.createCompleted.sync = true;
      actions.createCompleted(note);
    });
  },

  onCreateCompleted: function onCreateCompleted(note) {
    state.data = state.data.set(note._id, _immutable2['default'].fromJS(Maker(note)));
    this.trigger(state);
  },

  onUpdate: function onUpdate(previous, updates) {
    var next = _.assign({}, previous, updates);
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/note', { verb: 'put', body: { note: next }, message: 'Cannot update note, check your backend server' }).then(function (note) {
      state.isLoading = false;
      actions.updateCompleted.sync = true;
      actions.updateCompleted(previous, note);
    });
  },

  onUpdateCompleted: function onUpdateCompleted(previous, note) {
    state.data = state.data.set(note._id, _immutable2['default'].fromJS(Maker(note)));
    this.trigger(state);
  },

  onDelete: function onDelete(note) {
    var id = note._id;
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/note/' + id, { verb: 'delete', message: 'Cannot delete note, check your backend server' }).then(function (res) {
      state.isLoading = false;
      actions.deleteCompleted.sync = true;
      actions.deleteCompleted(note);
    });
  },

  onDeleteCompleted: function onDeleteCompleted(note) {
    state.data = state.data['delete'](note._id);
    this.trigger(state);
  }

});

function Maker(obj) {
  obj.createdAt = (0, _moment2['default'])(obj.createdAt);
  if (obj.updatedAt) obj.updatedAt = (0, _moment2['default'])(obj.updatedAt);
  return obj;
}

exports.notesStore = store;
exports.notesActions = actions;
//# sourceMappingURL=notes.js.map
