'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createCompleted = createCompleted;
exports.deleteCompleted = deleteCompleted;
exports.createCompleted = createCompleted;
exports.updateCompleted = updateCompleted;
exports.filter = filter;
exports.sort = sort;
exports.loadMissions = loadMissions;
exports.deleteMission = deleteMission;
exports.updateMission = updateMission;
exports.createMission = createMission;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var LOAD_MISSIONS = 'LOAD_MISSIONS';
exports.LOAD_MISSIONS = LOAD_MISSIONS;
var MISSIONS_LOADED = 'MISSIONS_LOADED';
exports.MISSIONS_LOADED = MISSIONS_LOADED;
var SORT_MISSIONS = 'SORT_MISSIONS';
exports.SORT_MISSIONS = SORT_MISSIONS;
var FILTER_MISSIONS = 'FILTER_MISSIONS';
exports.FILTER_MISSIONS = FILTER_MISSIONS;
var MISSION_UPDATED = 'MISSION_UPDATED';
exports.MISSION_UPDATED = MISSION_UPDATED;
var MISSION_DELETED = 'MISSION_DELETED';
exports.MISSION_DELETED = MISSION_DELETED;
var MISSION_CREATED = 'MISSION_CREATED';

exports.MISSION_CREATED = MISSION_CREATED;

function createCompleted() {}

function deleteCompleted(mission) {
  return {
    type: MISSION_DELETED,
    id: mission._id
  };
}

function createCompleted(mission) {
  return {
    type: MISSION_CREATED,
    mission: _immutable2['default'].fromJS(Maker(mission))
  };
}

function updateCompleted(mission) {
  return {
    type: MISSION_UPDATED,
    mission: _immutable2['default'].fromJS(Maker(mission))
  };
}

function missionsLoaded(missions) {
  return {
    type: MISSIONS_LOADED,
    missions: _immutable2['default'].fromJS(_lodash2['default'].reduce(missions, function (res, p) {
      res[p._id] = Maker(p);return res;
    }, {}))
  };
}

function filter(filter) {
  return {
    type: FILTER_MISSIONS,
    filter: filter
  };
}

function sort(by) {
  return {
    type: SORT_MISSIONS,
    by: by
  };
}

function loadMissions() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$forceReload = _ref.forceReload;
  var forceReload = _ref$forceReload === undefined ? false : _ref$forceReload;
  var _ref$ids = _ref.ids;
  var ids = _ref$ids === undefined ? [] : _ref$ids;

  return function (dispatch, getState) {
    var state = getState();
    var objs = _lodash2['default'].map(ids, function (id) {
      return state.missions.data.get(id);
    });
    var doRequest = forceReload || !_lodash2['default'].every(objs) || !state.missions.data.size;
    if (!doRequest) return;

    var url = '/api/missions';
    dispatch({ type: LOAD_MISSIONS });
    (0, _utils.requestJson)(url, dispatch, getState, { message: 'Cannot load missions, check your backend server' }).then(function (missions) {
      dispatch(missionsLoaded(missions));
    });
  };
}

function deleteMission(mission) {
  return function (dispatch, getState) {
    var id = mission._id;
    (0, _utils.requestJson)('/api/mission/' + id, dispatch, getState, { verb: 'delete', message: 'Cannot delete mission, check your backend server' }).then(function (res) {
      return dispatch(deleteCompleted(mission));
    });
  };
}

function updateMission(previous, updates) {
  return function (dispatch, getState) {
    (0, _utils.requestJson)('/api/mission', dispatch, getState, { verb: 'put', body: { mission: _lodash2['default'].assign({}, previous, updates) }, message: 'Cannot update mission, check your backend server' }).then(function (mission) {
      dispatch(updateCompleted(mission));
    });
  };
}

function createMission(mission) {
  return function (dispatch, getState) {
    (0, _utils.requestJson)('/api/missions', dispatch, getState, { verb: 'post', body: { mission: mission }, message: 'Cannot create mission, check your backend server' }).then(function (mission) {
      return dispatch(createCompleted(mission));
    });
  };
}

var missionsActions = {
  createCompleted: createCompleted,
  updateCompleted: updateCompleted,
  deleteCompleted: deleteCompleted,
  load: loadMissions,
  create: createMission,
  update: updateMission,
  'delete': deleteMission,
  sort: sort,
  filter: filter
};

exports.missionsActions = missionsActions;
function Maker(obj) {
  if (obj.createdAt) obj.createdAt = (0, _moment2['default'])(obj.createdAt || new Date(1967, 9, 1));
  if (obj.updatedAt) obj.updatedAt = (0, _moment2['default'])(obj.updatedAt || new Date(1967, 9, 1));
  if (obj.startDate) obj.startDate = (0, _moment2['default'])(obj.startDate).toDate();
  if (obj.endDate) obj.endDate = (0, _moment2['default'])(obj.endDate).toDate();
  return obj;
}
//# sourceMappingURL=missions.js.map
