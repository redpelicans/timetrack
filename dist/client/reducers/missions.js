'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = missionsReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionsMissions = require('../actions/missions');

var initialState = {
  data: _immutable2['default'].Map(),
  filter: '',
  sortCond: {
    by: 'name',
    order: 'asc'
  }
};

function missionsReducer(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case _actionsMissions.MISSION_DELETED:
      return _extends({}, state, {
        data: state.data['delete'](action.id)
      });
    case _actionsMissions.MISSION_UPDATED:
    case _actionsMissions.MISSION_CREATED:
      return _extends({}, state, {
        data: state.data.set(action.mission.get('_id'), action.mission)
      });
    case _actionsMissions.FILTER_MISSIONS:
      return _extends({}, state, {
        filter: action.filter
      });
    case _actionsMissions.SORT_MISSIONS:
      var sortCond = {
        by: action.by,
        order: state.sortCond.by === action.by ? ({ asc: 'desc', desc: 'asc' })[state.sortCond.order] : state.sortCond.order
      };
      return _extends({}, state, {
        sortCond: sortCond
      });
    case _actionsMissions.MISSIONS_LOADED:
      return _extends({}, state, {
        data: action.missions
      });
    default:
      return state;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=missions.js.map
