'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = companiesReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionsCompanies = require('../actions/companies');

var initialState = {
  data: _immutable2['default'].Map(),
  filter: '',
  filterPreferred: false,
  sortCond: {
    by: 'name',
    order: 'asc'
  }
};

function companiesReducer(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case _actionsCompanies.UPDATE_TAGS_COMPLETED:
      return _extends({}, state, {
        data: state.data.update(action.id, function (p) {
          return p.set('tags', action.tags);
        })
      });
    case _actionsCompanies.COMPANY_TOGGLE_PREFERRED_COMPLETED:
      return _extends({}, state, {
        data: state.data.update(action.id, function (p) {
          return p.set('preferred', action.preferred);
        })
      });
    case _actionsCompanies.COMPANY_DELETED:
      return _extends({}, state, {
        data: state.data['delete'](action.id)
      });
    case _actionsCompanies.COMPANY_UPDATED:
    case _actionsCompanies.COMPANY_CREATED:
      return _extends({}, state, {
        data: state.data.set(action.company.get('_id'), action.company)
      });
    case _actionsCompanies.FILTER_COMPANIES:
      return _extends({}, state, {
        filter: action.filter
      });
    case _actionsCompanies.SORT_COMPANIES:
      var sortCond = {
        by: action.by,
        order: state.sortCond.by === action.by ? ({ asc: 'desc', desc: 'asc' })[state.sortCond.order] : state.sortCond.order
      };
      return _extends({}, state, {
        sortCond: sortCond
      });
    case _actionsCompanies.TOGGLE_PREFERRED_FILTER:
      return _extends({}, state, {
        filterPreferred: !state.filterPreferred
      });
    case _actionsCompanies.COMPANIES_LOADED:
      return _extends({}, state, {
        data: action.companies
      });
    default:
      return state;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=companies.js.map
