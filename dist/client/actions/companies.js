'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createCompleted = createCompleted;
exports.deleteCompleted = deleteCompleted;
exports.createCompleted = createCompleted;
exports.updateCompleted = updateCompleted;
exports.filter = filter;
exports.sort = sort;
exports.togglePreferred = togglePreferred;
exports.togglePreferredFilter = togglePreferredFilter;
exports.loadCompanies = loadCompanies;
exports.deleteCompany = deleteCompany;
exports.updateCompany = updateCompany;
exports.createCompany = createCompany;
exports.updateTags = updateTags;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var LOAD_COMPANIES = 'LOAD_COMPANIES';
exports.LOAD_COMPANIES = LOAD_COMPANIES;
var COMPANIES_LOADED = 'COMPANIES_LOADED';
exports.COMPANIES_LOADED = COMPANIES_LOADED;
var TOGGLE_PREFERRED_FILTER = 'TOGGLE_PREFERRED_FILTER';
exports.TOGGLE_PREFERRED_FILTER = TOGGLE_PREFERRED_FILTER;
var SORT_COMPANIES = 'SORT_COMPANIES';
exports.SORT_COMPANIES = SORT_COMPANIES;
var FILTER_COMPANIES = 'FILTER_COMPANIES';
exports.FILTER_COMPANIES = FILTER_COMPANIES;
var COMPANY_UPDATED = 'COMPANY_UPDATED';
exports.COMPANY_UPDATED = COMPANY_UPDATED;
var COMPANY_DELETED = 'COMPANY_DELETED';
exports.COMPANY_DELETED = COMPANY_DELETED;
var COMPANY_CREATED = 'COMPANY_CREATED';
exports.COMPANY_CREATED = COMPANY_CREATED;
var COMPANY_TOGGLE_PREFERRED_COMPLETED = 'COMPANY_TOGGLE_PREFERRED_COMPLETED';
exports.COMPANY_TOGGLE_PREFERRED_COMPLETED = COMPANY_TOGGLE_PREFERRED_COMPLETED;
var UPDATE_TAGS_COMPLETED = 'UPDATE_TAGS_COMPLETED';

exports.UPDATE_TAGS_COMPLETED = UPDATE_TAGS_COMPLETED;

function createCompleted() {}

function deleteCompleted(company) {
  return {
    type: COMPANY_DELETED,
    id: company._id
  };
}

function createCompleted(company) {
  return {
    type: COMPANY_CREATED,
    company: _immutable2['default'].fromJS(Maker(company))
  };
}

function updateCompleted(company) {
  return {
    type: COMPANY_UPDATED,
    company: _immutable2['default'].fromJS(Maker(company))
  };
}

function companiesLoaded(companies) {
  return {
    type: COMPANIES_LOADED,
    companies: _immutable2['default'].fromJS(_lodash2['default'].reduce(companies, function (res, p) {
      res[p._id] = Maker(p);return res;
    }, {}))
  };
}

function togglePreferredCompleted(id, preferred) {
  return {
    type: COMPANY_TOGGLE_PREFERRED_COMPLETED,
    id: id,
    preferred: preferred
  };
}

function filter(filter) {
  return {
    type: FILTER_COMPANIES,
    filter: filter
  };
}

function sort(by) {
  return {
    type: SORT_COMPANIES,
    by: by
  };
}

function togglePreferred(company) {
  return function (dispatch, getState) {
    var body = { id: company._id, preferred: !company.preferred };
    var message = 'Cannot toggle preferred status, check your backend server';
    var request = (0, _utils.requestJson)('/api/companies/preferred', dispatch, getState, { verb: 'post', body: body, message: message });

    request.then(function (res) {
      var state = getState();
      dispatch(togglePreferredCompleted(res._id, body.preferred));
    });
  };
}

function togglePreferredFilter() {
  return {
    type: TOGGLE_PREFERRED_FILTER
  };
}

function loadCompanies() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$forceReload = _ref.forceReload;
  var forceReload = _ref$forceReload === undefined ? false : _ref$forceReload;
  var _ref$ids = _ref.ids;
  var ids = _ref$ids === undefined ? [] : _ref$ids;

  return function (dispatch, getState) {
    var state = getState();
    var objs = _lodash2['default'].map(ids, function (id) {
      return state.companies.data.get(id);
    });
    var doRequest = forceReload || !_lodash2['default'].every(objs) || !state.companies.data.size;
    if (!doRequest) return;

    var url = '/api/companies';
    dispatch({ type: LOAD_COMPANIES });
    (0, _utils.requestJson)(url, dispatch, getState, { message: 'Cannot load companies, check your backend server' }).then(function (companies) {
      dispatch(companiesLoaded(companies));
    });
  };
}

function deleteCompany(company) {
  return function (dispatch, getState) {
    var id = company._id;
    (0, _utils.requestJson)('/api/company/' + id, dispatch, getState, { verb: 'delete', message: 'Cannot delete company, check your backend server' }).then(function (res) {
      return dispatch(deleteCompleted(company));
    });
  };
}

function updateCompany(previous, updates) {
  return function (dispatch, getState) {
    (0, _utils.requestJson)('/api/company', dispatch, getState, { verb: 'put', body: { company: _extends({}, previous, updates) }, message: 'Cannot update company, check your backend server' }).then(function (company) {
      dispatch(updateCompleted(company));
    });
  };
}

function createCompany(company) {
  return function (dispatch, getState) {
    (0, _utils.requestJson)('/api/companies', dispatch, getState, { verb: 'post', body: { company: company }, message: 'Cannot create company, check your backend server' }).then(function (company) {
      dispatch(createCompleted(company));
    });
  };
}

function updateTagsCompleted(company) {
  return {
    type: UPDATE_TAGS_COMPLETED,
    id: company._id,
    tags: _immutable2['default'].fromJS(company.tags)
  };
}

function updateTags(company, tags) {
  return function (dispatch, getState) {
    var body = { _id: company._id, tags: tags };
    var message = 'Cannot update tags, check your backend server';
    var request = (0, _utils.requestJson)('/api/companies/tags', dispatch, getState, { verb: 'post', body: body, message: message });

    request.then(function (company) {
      return dispatch(updateTagsCompleted(company));
    });
  };
}

var companiesActions = {
  updateTags: updateTags,
  createCompleted: createCompleted,
  updateCompleted: updateCompleted,
  deleteCompleted: deleteCompleted,
  load: loadCompanies,
  create: createCompany,
  update: updateCompany,
  'delete': deleteCompany,
  togglePreferredFilter: togglePreferredFilter,
  togglePreferred: togglePreferred,
  sort: sort,
  filter: filter
};

exports.companiesActions = companiesActions;
function Maker(doc) {
  doc.createdAt = (0, _moment2['default'])(doc.createdAt);
  if (doc.updatedAt) doc.updatedAt = (0, _moment2['default'])(doc.updatedAt);
  return doc;
}
//# sourceMappingURL=companies.js.map
