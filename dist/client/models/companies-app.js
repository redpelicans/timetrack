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

var _persons = require('./persons');

var _companies = require('./companies');

var actions = _reflux2['default'].createActions(["load", "delete", "create", "update", "loadCompleted", "filter", "filterPreferred", "sort"]);

var state = {
  companies: _immutable2['default'].Map(),
  persons: _immutable2['default'].Map(),
  data: _immutable2['default'].List(),
  isLoading: false,
  filter: undefined,
  filterPreferred: false,
  sort: {
    by: 'name',
    order: 'asc'
  }
};

var store = _reflux2['default'].createStore({

  listenables: [actions],

  getInitialState: function getInitialState() {
    return state;
  },

  init: function init() {
    var _this = this;

    _companies.companiesStore.listen(function (companies) {
      state.companies = companies.data;
      state.data = filterAndSort();
      state.isLoading = companies.isLoading;
      _this.trigger(state);
    });
  },

  onLoad: function onLoad() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$forceReload = _ref.forceReload;
    var forceReload = _ref$forceReload === undefined ? false : _ref$forceReload;
    var ids = _ref.ids;

    _companies.companiesActions.load({ forceReload: forceReload, ids: ids });
    _persons.personsActions.load();
  },

  onFilterPreferred: function onFilterPreferred(filter) {
    state.filterPreferred = filter;
    state.data = filterAndSort();
    this.trigger(state);
  },

  onFilter: function onFilter(filter) {
    state.filter = filter;
    state.data = filterAndSort();
    this.trigger(state);
  },

  onSort: function onSort(by) {
    if (state.sort.by === by) state.sort.order = ({ asc: 'desc', desc: 'asc' })[state.sort.order];
    state.sort.by = by;
    state.data = filterAndSort();
    this.trigger(state);
  }
});

function filterAndSort() {
  var companies = state.companies;
  var filter = state.filter;
  var filterPreferred = state.filterPreferred;
  var sort = state.sort;

  return companies.toSetSeq().filter(filterForSearch(filter)).filter(filterForPreferred(filterPreferred)).sort(function (a, b) {
    return sortByCond(a, b, sort.by, sort.order);
  });
}

function sortByCond(a, b, attr, order) {
  return order === 'asc' ? sortBy(a, b, attr) : sortBy(b, a, attr);
}

function sortBy(a, b, attr) {
  if (a.get(attr) === b.get(attr)) return attr !== 'name' ? sortByCond(a, b, 'name', 'desc') : 0;
  if (attr != 'name') return a.get(attr) < b.get(attr) ? 1 : -1;
  return a.get(attr) >= b.get(attr) ? 1 : -1;
}

function filterForPreferred(filter) {
  return function (p) {
    return filter ? p.get('preferred') : true;
  };
}

function filterForSearch() {
  var filter = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  return function (c) {
    var name = c.get('name') || '';
    return name.toLowerCase().indexOf(filter) !== -1;
  };
}

function filterForSearch() {
  var filter = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  function filterByName(key, name) {
    return name.indexOf(key) !== -1;
  }

  function filterByTag(key, tags) {
    var tag = key.slice(1);
    if (!tag) return true;
    return tags.indexOf(tag) !== -1;
  }

  var keys = _.chain(filter.split(' ')).compact().map(function (key) {
    return key.toLowerCase();
  }).value();
  return function (p) {
    var name = p.get('name').toLowerCase();
    var tags = _.chain(p.get('tags') && p.get('tags').toJS() || []).map(function (tag) {
      return tag.toLowerCase();
    }).value().join(' ');
    return _.all(keys, function (key) {
      return key.startsWith('#') ? filterByTag(key, tags) : filterByName(key, name);
    });
  };
}

var sortMenu = [{ key: 'name', label: 'Sort Alphabeticaly' }, { key: 'billable', label: 'Sort by billable amount' }, { key: 'billed', label: 'Sort by billed amount' }, { key: 'createdAt', label: 'Sort by creation date' }, { key: 'updatedAt', label: 'Sort by updated date' }];

exports.sortMenu = sortMenu;
exports.companiesAppStore = store;
exports.companiesAppActions = actions;
//# sourceMappingURL=companies-app.js.map
