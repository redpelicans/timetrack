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

var _missions = require('./missions');

var _companies = require('./companies');

var _persons = require('./persons');

var actions = _reflux2['default'].createActions(["load", "filter", "filterPreferred", "sort", "togglePreferred"]);

var state = {
  missions: _immutable2['default'].Map(),
  persons: _immutable2['default'].Map(),
  companies: _immutable2['default'].Map(),
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

  init: function init() {
    var _this = this;

    _companies.companiesStore.listen(function (companies) {
      state.companies = companies.data;
      state.data = filterAndSort();
      _this.trigger(state);
    });

    _persons.personsStore.listen(function (persons) {
      state.persons = persons.data;
      state.data = filterAndSort();
      _this.trigger(state);
    });

    _missions.missionsStore.listen(function (missions) {
      state.missions = missions.data;
      state.data = filterAndSort();
      state.isLoading = missions.isLoading;
      _this.trigger(state);
    });
  },

  onLoad: function onLoad() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$forceReload = _ref.forceReload;
    var forceReload = _ref$forceReload === undefined ? false : _ref$forceReload;
    var ids = _ref.ids;

    state.missions = _immutable2['default'].Map();
    this.trigger(state);
    _missions.missionsActions.load({ forceReload: forceReload, ids: ids });
    _companies.companiesActions.load({ forceReload: forceReload });
    _persons.personsActions.load({ forceReload: forceReload });
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
  var missions = state.missions;
  var filter = state.filter;
  var filterPreferred = state.filterPreferred;
  var sort = state.sort;

  return missions.toSetSeq().filter(filterForSearch(filter))
  //.filter(filterForPreferred(filterPreferred))
  .sort(function (a, b) {
    return sortByCond(a, b, sort.by, sort.order);
  });
}

function sortByCond(a, b, attr, order) {
  return order === 'asc' ? sortBy(a, b, attr) : sortBy(b, a, attr);
}

function sortBy(a, b, attr) {
  if (a.get(attr) === b.get(attr)) return attr !== 'name' ? sortByCond(a, b, 'name', 'desc') : 0;
  if (attr != 'name') return a.get(attr) < b.get(attr) ? 1 : -1;
  return a.get(attr) > b.get(attr) ? 1 : -1;
}

function filterForPreferred(filter) {
  return function (p) {
    return filter ? p.get('preferred') : true;
  };
}

function filterForSearch() {
  var filter = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  return function (p) {
    var company = state.companies.get(p.get('clientId'));
    var name = [p.get('name'), company && company.get('name')].join(' ');
    return name.toLowerCase().indexOf(filter) !== -1;
  };
}

var sortMenu = [{ key: 'name', label: 'Sort Alphabeticaly' }, { key: 'createdAt', label: 'Sort by creation date' }, { key: 'updatedAt', label: 'Sort by updated date' }];

exports.sortMenu = sortMenu;
exports.missionsAppStore = store;
exports.missionsAppActions = actions;
//# sourceMappingURL=missions-app.js.map
