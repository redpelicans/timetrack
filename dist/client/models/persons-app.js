'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _companies = require('./companies');

var _persons = require('./persons');

var actions = _reflux2['default'].createActions(["load", "filter", "filterPreferred", "sort", "togglePreferred"]);

var state = {
  data: _immutable2['default'].List(),
  persons: _immutable2['default'].Map(),
  companies: _immutable2['default'].Map(),
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

    // this.joinTrailing(companiesActions.loadCompleted, personsActions.loadCompleted, (res1, res2) => {
    //   console.log("personListAppStore loaded.")
    //   const companies = res1[0];
    //   const persons = res2[0];
    //   state.companies = companies;
    //   state.persons = persons;
    //   state.data = filterAndSort();
    //   this.trigger(state);
    // });

    _companies.companiesStore.listen(function (companies) {
      state.companies = companies.data;
      state.data = filterAndSort();
      _this.trigger(state);
    });

    _persons.personsStore.listen(function (persons) {
      state.persons = persons.data;
      state.data = filterAndSort();
      state.isLoading = persons.isLoading;
      _this.trigger(state);
    });
  },

  onLoad: function onLoad() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$forceReload = _ref.forceReload;
    var forceReload = _ref$forceReload === undefined ? false : _ref$forceReload;
    var ids = _ref.ids;

    state.persons = _immutable2['default'].Map();
    state.companies = _immutable2['default'].Map();
    this.trigger(state);
    _persons.personsActions.load({ forceReload: forceReload, ids: ids });
    _companies.companiesActions.load({ forceReload: forceReload });
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
  var persons = state.persons;
  var filter = state.filter;
  var filterPreferred = state.filterPreferred;
  var sort = state.sort;

  return persons.toSetSeq().filter(filterForSearch(filter)).filter(filterForPreferred(filterPreferred)).sort(function (a, b) {
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

  if (!filter) return function (p) {
    return p;
  };

  function filterByName(p, key) {
    var company = state.companies.get(p.get('companyId'));
    var name = [p.get('name').toLowerCase(), company && company.get('name').toLowerCase(), p.get('email')].join(' ');
    return name.indexOf(key) !== -1;
  }

  function filterByTag(p, key) {
    var tags = _lodash2['default'].chain(p.get('tags') && p.get('tags').toJS() || []).map(function (tag) {
      return tag.toLowerCase();
    }).value().join(' ');
    var tag = key.slice(1);
    if (!tag) return true;
    return tags.indexOf(tag) !== -1;
  }

  function filterByRole(p, key) {
    var roles = _lodash2['default'].chain(p.get('roles') && p.get('roles').toJS() || []).map(function (role) {
      return role.toLowerCase();
    }).value().join(' ');
    var role = key.slice(1);
    if (!role) return true;
    return roles.indexOf(role) !== -1;
  }

  function filterBySkills(p, key) {
    var skills = _lodash2['default'].chain(p.get('skills') && p.get('skills').toJS() || []).map(function (skill) {
      return skill.toLowerCase();
    }).value().join(' ');
    var skill = key.slice(1);
    if (!skill) return true;
    return skills.indexOf(skill) !== -1;
  }

  function filterMode(p) {
    return function (key) {
      return (({
        '#': filterByTag,
        '!': filterByRole,
        '+': filterBySkills
      })[key[0]] || filterByName)(p, key);
    };
  }

  var keys = _lodash2['default'].chain(filter.split(' ')).compact().map(function (key) {
    return key.toLowerCase();
  }).value();

  return function (p) {
    return _lodash2['default'].all(keys, filterMode(p));
  };
}

var sortMenu = [{ key: 'name', label: 'Sort Alphabeticaly' }, { key: 'createdAt', label: 'Sort by creation date' }, { key: 'updatedAt', label: 'Sort by updated date' }];

exports.sortMenu = sortMenu;
exports.personsAppStore = store;
exports.personsAppActions = actions;
//# sourceMappingURL=persons-app.js.map
