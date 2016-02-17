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

var actions = _reflux2['default'].createActions(["load", "loadCompleted", "create", "createCompleted", "delete", "deleteCompleted", "update", "updateCompleted", "close", "open"]);

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

    console.log("start loading missions ...");
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/missions', { message: 'Cannot load missions, check your backend server' }).then(function (missions) {
      actions.loadCompleted.sync = true;
      actions.loadCompleted(_immutable2['default'].fromJS(_.chain(missions).map(function (p) {
        return [p._id, Maker(p)];
      }).object().value()));
    });
  },

  onLoadCompleted: function onLoadCompleted(data) {
    state.data = data;
    state.isLoading = false;
    this.trigger(state);
  },

  onCreate: function onCreate(mission) {
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/missions', { verb: 'post', body: { mission: mission }, message: 'Cannot create mission, check your backend server' }).then(function (mission) {
      state.isLoading = false;
      actions.createCompleted.sync = true;
      actions.createCompleted(mission);
    });
  },

  onCreateCompleted: function onCreateCompleted(mission) {
    state.data = state.data.set(mission._id, _immutable2['default'].fromJS(Maker(mission)));
    this.trigger(state);
  },

  onUpdate: function onUpdate(previous, updates) {
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/mission', { verb: 'put', body: { mission: _.assign({}, previous, updates) }, message: 'Cannot update mission, check your backend server' }).then(function (mission) {
      state.isLoading = false;
      actions.updateCompleted.sync = true;
      actions.updateCompleted(previous, mission);
    });
  },

  onUpdateCompleted: function onUpdateCompleted(previous, mission) {
    state.data = state.data.set(mission._id, _immutable2['default'].fromJS(Maker(mission)));
    this.trigger(state);
  },

  onClose: function onClose(mission) {
    actions.update(mission, { status: 'closed' });
  },

  onOpen: function onOpen(mission) {
    actions.update(mission, { status: 'open' });
  },

  onDelete: function onDelete(mission) {
    var id = mission._id;
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/mission/' + id, { verb: 'delete', message: 'Cannot delete mission, check your backend server' }).then(function (res) {
      state.isLoading = false;
      actions.deleteCompleted.sync = true;
      actions.deleteCompleted(mission);
    });
  },

  onDeleteCompleted: function onDeleteCompleted(mission) {
    state.data = state.data['delete'](mission._id);
    this.trigger(state);
  }

});

function Maker(obj) {
  if (obj.createdAt) obj.createdAt = (0, _moment2['default'])(obj.createdAt || new Date(1967, 9, 1));
  if (obj.updatedAt) obj.updatedAt = (0, _moment2['default'])(obj.updatedAt || new Date(1967, 9, 1));
  if (obj.startDate) obj.startDate = (0, _moment2['default'])(obj.startDate).toDate();
  if (obj.endDate) obj.endDate = (0, _moment2['default'])(obj.endDate).toDate();
  return obj;
}

exports.missionsStore = store;
exports.missionsActions = actions;
//# sourceMappingURL=missions.js.map
