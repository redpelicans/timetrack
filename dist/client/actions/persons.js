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
exports.togglePreferred = togglePreferred;
exports.togglePreferredFilter = togglePreferredFilter;
exports.loadPersons = loadPersons;
exports.deletePerson = deletePerson;
exports.updatePerson = updatePerson;
exports.createPerson = createPerson;
exports.updateTags = updateTags;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var LOAD_PERSONS = 'LOAD_PERSONS';
exports.LOAD_PERSONS = LOAD_PERSONS;
var PERSONS_LOADED = 'PERSONS_LOADED';
exports.PERSONS_LOADED = PERSONS_LOADED;
var TOGGLE_PREFERRED_FILTER = 'TOGGLE_PREFERRED_FILTER';
exports.TOGGLE_PREFERRED_FILTER = TOGGLE_PREFERRED_FILTER;
var SORT_PERSONS = 'SORT_PERSONS';
exports.SORT_PERSONS = SORT_PERSONS;
var FILTER_PERSONS = 'FILTER_PERSONS';
exports.FILTER_PERSONS = FILTER_PERSONS;
var PERSON_UPDATED = 'PERSON_UPDATED';
exports.PERSON_UPDATED = PERSON_UPDATED;
var PERSON_DELETED = 'PERSON_DELETED';
exports.PERSON_DELETED = PERSON_DELETED;
var PERSON_CREATED = 'PERSON_CREATED';
exports.PERSON_CREATED = PERSON_CREATED;
var PERSON_TOGGLE_PREFERRED_COMPLETED = 'PERSON_TOGGLE_PREFERRED_COMPLETED';
exports.PERSON_TOGGLE_PREFERRED_COMPLETED = PERSON_TOGGLE_PREFERRED_COMPLETED;
var PERSON_UPDATE_TAGS_COMPLETED = 'PERSON_UPDATE_TAGS_COMPLETED';

exports.PERSON_UPDATE_TAGS_COMPLETED = PERSON_UPDATE_TAGS_COMPLETED;

function createCompleted() {}

function deleteCompleted(person) {
  return {
    type: PERSON_DELETED,
    id: person._id
  };
}

function createCompleted(person) {
  return {
    type: PERSON_CREATED,
    person: _immutable2['default'].fromJS(Maker(person))
  };
}

function updateCompleted(person) {
  return {
    type: PERSON_UPDATED,
    person: _immutable2['default'].fromJS(Maker(person))
  };
}

function personsLoaded(persons) {
  return {
    type: PERSONS_LOADED,
    persons: _immutable2['default'].fromJS(_lodash2['default'].reduce(persons, function (res, p) {
      res[p._id] = Maker(p);return res;
    }, {}))
  };
}

function togglePreferredCompleted(id, preferred) {
  return {
    type: PERSON_TOGGLE_PREFERRED_COMPLETED,
    id: id,
    preferred: preferred
  };
}

function filter(filter) {
  return {
    type: FILTER_PERSONS,
    filter: filter
  };
}

function sort(by) {
  return {
    type: SORT_PERSONS,
    by: by
  };
}

function togglePreferred(person) {
  return function (dispatch, getState) {
    var body = { id: person._id, preferred: !person.preferred };
    var message = 'Cannot toggle preferred status, check your backend server';
    var request = (0, _utils.requestJson)('/api/people/preferred', dispatch, getState, { verb: 'post', body: body, message: message });

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

function loadPersons() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$forceReload = _ref.forceReload;
  var forceReload = _ref$forceReload === undefined ? false : _ref$forceReload;
  var _ref$ids = _ref.ids;
  var ids = _ref$ids === undefined ? [] : _ref$ids;

  return function (dispatch, getState) {
    var state = getState();
    var objs = _lodash2['default'].map(ids, function (id) {
      return state.persons.data.get(id);
    });
    var doRequest = forceReload || !_lodash2['default'].every(objs) || !state.persons.data.size;
    if (!doRequest) return;

    var url = '/api/people';
    dispatch({ type: LOAD_PERSONS });
    (0, _utils.requestJson)(url, dispatch, getState, { message: 'Cannot load persons, check your backend server' }).then(function (persons) {
      dispatch(personsLoaded(persons));
    });
  };
}

function deletePerson(person) {
  return function (dispatch, getState) {
    var id = person._id;
    (0, _utils.requestJson)('/api/person/' + id, dispatch, getState, { verb: 'delete', message: 'Cannot delete person, check your backend server' }).then(function (res) {
      return dispatch(deleteCompleted(person));
    });
  };
}

function updatePerson(previous, updates) {
  return function (dispatch, getState) {
    (0, _utils.requestJson)('/api/person', dispatch, getState, { verb: 'put', body: { person: _lodash2['default'].assign({}, previous, updates) }, message: 'Cannot update person, check your backend server' }).then(function (person) {
      dispatch(updateCompleted(person));
    });
  };
}

function createPerson(person) {
  return function (dispatch, getState) {
    (0, _utils.requestJson)('/api/people', dispatch, getState, { verb: 'post', body: { person: person }, message: 'Cannot create person, check your backend server' }).then(function (person) {
      dispatch(createCompleted(person));
    });
  };
}

function updateTagsCompleted(person) {
  return {
    type: PERSON_UPDATE_TAGS_COMPLETED,
    id: person._id,
    tags: _immutable2['default'].fromJS(person.tags)
  };
}

function updateTags(person, tags) {
  return function (dispatch, getState) {
    var body = { _id: person._id, tags: tags };
    var message = 'Cannot update tags, check your backend server';
    var request = (0, _utils.requestJson)('/api/people/tags', dispatch, getState, { verb: 'post', body: body, message: message });

    request.then(function (person) {
      return dispatch(updateTagsCompleted(person));
    });
  };
}

var personsActions = {
  updateTags: updateTags,
  createCompleted: createCompleted,
  updateCompleted: updateCompleted,
  deleteCompleted: deleteCompleted,
  load: loadPersons,
  create: createPerson,
  update: updatePerson,
  'delete': deletePerson,
  togglePreferredFilter: togglePreferredFilter,
  togglePreferred: togglePreferred,
  sort: sort,
  filter: filter
};

exports.personsActions = personsActions;
function Maker(doc) {
  doc.createdAt = (0, _moment2['default'])(doc.createdAt);
  if (doc.updatedAt) doc.updatedAt = (0, _moment2['default'])(doc.updatedAt);
  return doc;
}
//# sourceMappingURL=persons.js.map
