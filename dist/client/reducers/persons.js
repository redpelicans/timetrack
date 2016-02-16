'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = personsReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionsPersons = require('../actions/persons');

var initialState = {
  data: _immutable2['default'].Map(),
  filter: '',
  filterPreferred: false,
  sortCond: {
    by: 'name',
    order: 'asc'
  }
};

function personsReducer(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case _actionsPersons.PERSON_UPDATE_TAGS_COMPLETED:
      return _extends({}, state, {
        data: state.data.update(action.id, function (p) {
          return p.set('tags', action.tags);
        })
      });
    case _actionsPersons.PERSON_TOGGLE_PREFERRED_COMPLETED:
      return _extends({}, state, {
        data: state.data.update(action.id, function (p) {
          return p.set('preferred', action.preferred);
        })
      });
    case _actionsPersons.PERSON_DELETED:
      return _extends({}, state, {
        data: state.data['delete'](action.id)
      });
    case _actionsPersons.PERSON_UPDATED:
    case _actionsPersons.PERSON_CREATED:
      return _extends({}, state, {
        data: state.data.set(action.person.get('_id'), action.person)
      });
    case _actionsPersons.FILTER_PERSONS:
      return _extends({}, state, {
        filter: action.filter
      });
    case _actionsPersons.SORT_PERSONS:
      var sortCond = {
        by: action.by,
        order: state.sortCond.by === action.by ? ({ asc: 'desc', desc: 'asc' })[state.sortCond.order] : state.sortCond.order
      };
      return _extends({}, state, {
        sortCond: sortCond
      });
    case _actionsPersons.TOGGLE_PREFERRED_FILTER:
      return _extends({}, state, {
        filterPreferred: !state.filterPreferred
      });
    case _actionsPersons.PERSONS_LOADED:
      return _extends({}, state, {
        data: action.persons
      });
    default:
      return state;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=persons.js.map
