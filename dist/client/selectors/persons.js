'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reselect = require('reselect');

var persons = function persons(state) {
  return state.persons.data;
};
var companies = function companies(state) {
  return state.companies.data;
};
var skills = function skills(state) {
  return state.skills;
};
var userCompanyId = function userCompanyId(state) {
  return state.login.user.get('companyId');
};
var missions = function missions(state) {
  return state.missions.data;
};
var filterSelector = function filterSelector(state) {
  return state.persons.filter;
};
var sortCondSelector = function sortCondSelector(state) {
  return state.persons.sortCond;
};
var preferredSelector = function preferredSelector(state) {
  return state.persons.filterPreferred;
};
var pendingRequests = function pendingRequests(state) {
  return state.pendingRequests;
};
var personId = function personId(state) {
  return state.routing.location.state && state.routing.location.state.personId;
};
var companyId = function companyId(state) {
  return state.routing.location.state && state.routing.location.state.companyId;
};

var getFilterMissionById = function getFilterMissionById(id) {
  return function (mission) {
    var workers = mission.get('workerIds');
    return mission.get('managerId') === id || workers && workers.toJS().indexOf(id) !== -1;
  };
};

var newPersonSelector = (0, _reselect.createSelector)(companyId, companies, skills, userCompanyId, function (companyId, companies, skills, userCompanyId) {
  return {
    userCompanyId: userCompanyId,
    companyId: companyId,
    companies: companies,
    skills: skills
  };
});

exports.newPersonSelector = newPersonSelector;
var editPersonSelector = (0, _reselect.createSelector)(personId, persons, companies, skills, userCompanyId, function (personId, persons, companies, skills, userCompanyId) {
  return {
    person: persons.get(personId),
    company: personId ? companies.get(persons.get(personId).get('companyId')) : null,
    companies: companies,
    skills: skills,
    userCompanyId: userCompanyId
  };
});

exports.editPersonSelector = editPersonSelector;
var viewPersonSelector = (0, _reselect.createSelector)(personId, companies, persons, missions, pendingRequests, function (personId, companies, persons, missions, pendingRequests) {
  return {
    person: persons.get(personId),
    company: personId ? companies.get(persons.get(personId).get('companyId')) : null,
    missions: missions.filter(getFilterMissionById(personId)),
    companies: companies,
    persons: persons,
    isLoading: !!pendingRequests
  };
});

exports.viewPersonSelector = viewPersonSelector;
var visiblePersonsSelector = (0, _reselect.createSelector)(persons, companies, filterSelector, sortCondSelector, preferredSelector, pendingRequests, function (persons, companies, filter, sortCond, filterPreferred, pendingRequests) {
  return {
    persons: filterAndSort(persons, companies, filter, sortCond, filterPreferred),
    companies: companies,
    filter: filter,
    sortCond: sortCond,
    filterPreferred: filterPreferred,
    isLoading: !!pendingRequests
  };
});

exports.visiblePersonsSelector = visiblePersonsSelector;
function filterAndSort(persons, companies, filter, sort, filterPreferred) {
  return persons.toSetSeq().filter(filterForSearch(filter, companies)).filter(filterForPreferred(filterPreferred)).sort(function (a, b) {
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

function filterForSearch(filter, companies) {
  if (filter === undefined) filter = '';

  if (!filter) return function (p) {
    return p;
  };

  function filterByName(p, key) {
    var company = companies.get(p.get('companyId'));
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
    return _lodash2['default'].every(keys, filterMode(p));
  };
}
//# sourceMappingURL=persons.js.map
