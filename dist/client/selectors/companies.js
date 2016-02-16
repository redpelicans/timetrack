'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _reselect = require('reselect');

var companies = function companies(state) {
  return state.companies.data;
};
var missions = function missions(state) {
  return state.missions.data;
};
var persons = function persons(state) {
  return state.persons.data;
};
var filterSelector = function filterSelector(state) {
  return state.companies.filter;
};
var sortCondSelector = function sortCondSelector(state) {
  return state.companies.sortCond;
};
var preferredSelector = function preferredSelector(state) {
  return state.companies.filterPreferred;
};
var pendingRequests = function pendingRequests(state) {
  return state.pendingRequests;
};
var companyId = function companyId(state) {
  return state.routing.location.state && state.routing.location.state.companyId;
};

var editCompanySelector = (0, _reselect.createSelector)(companyId, companies, function (companyId, companies) {
  return {
    company: companies.get(companyId)
  };
});

exports.editCompanySelector = editCompanySelector;
var viewCompanySelector = (0, _reselect.createSelector)(companyId, companies, persons, missions, pendingRequests, function (companyId, companies, persons, missions, pendingRequests) {
  return {
    company: companies.get(companyId),
    isLoading: !!pendingRequests,
    persons: persons,
    missions: missions.filter(function (mission) {
      return mission.get("clientId") === companyId;
    }),
    companies: companies
  };
});

exports.viewCompanySelector = viewCompanySelector;
function filterCompanies(companies, filter, sortCond, filterPreferred) {
  return companies.toSetSeq();
}

var visibleCompaniesSelector = (0, _reselect.createSelector)(companies, filterSelector, sortCondSelector, preferredSelector, pendingRequests, function (companies, filter, sortCond, filterPreferred, pendingRequests) {
  return {
    companies: filterAndSort(companies, filter, sortCond, filterPreferred),
    isLoading: !!pendingRequests,
    filter: filter,
    sortCond: sortCond,
    filterPreferred: filterPreferred
  };
});

exports.visibleCompaniesSelector = visibleCompaniesSelector;
function filterAndSort(companies, filter, sort, filterPreferred) {
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
    return _.every(keys, function (key) {
      return key.startsWith('#') ? filterByTag(key, tags) : filterByName(key, name);
    });
  };
}
//# sourceMappingURL=companies.js.map
