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

var _companies = require('./companies');

var actions = _reflux2['default'].createActions(["load", "loadCompleted", "togglePreferred", "updateTags", "delete", "deleteCompleted", "create", "createCompleted", "update", "updateCompleted"]);

var state = {
  data: _immutable2['default'].Map(),
  isLoading: false
};

var store = _reflux2['default'].createStore({

  listenables: [actions],

  getInitialState: function getInitialState() {
    return state;
  },

  onLoad: function onLoad() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$forceReload = _ref.forceReload;
    var forceReload = _ref$forceReload === undefined ? false : _ref$forceReload;
    var ids = _ref.ids;

    var objs = _.map(ids || [], function (id) {
      return state.data.get(id);
    });
    var doRequest = forceReload || !_.all(objs) || !state.data.size;

    if (!doRequest) return actions.loadCompleted(state.data);

    console.log("start loading persons ...");
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/people', { message: 'Cannot load people, check your backend server' }).then(function (people) {
      actions.loadCompleted.sync = true;
      actions.loadCompleted(_immutable2['default'].fromJS(_.chain(people).map(function (p) {
        return [p._id, Maker(p)];
      }).object().value()));
    });
  },

  onLoadCompleted: function onLoadCompleted(data) {
    state.data = data;
    state.isLoading = false;
    this.trigger(state);
  },

  onTogglePreferred: function onTogglePreferred(person) {
    var _this = this;

    var body = { id: person.get('_id'), preferred: !person.get('preferred') };
    var message = 'Cannot toggle preferred status, check your backend server';
    var request = (0, _utils.requestJson)('/api/people/preferred', { verb: 'post', body: body, message: message });
    state.isLoading = true;
    this.trigger(state);

    request.then(function (res) {
      state.data = state.data.update(res._id, function (p) {
        return p.set('preferred', body.preferred);
      });
      state.isLoading = false;
      _this.trigger(state);
    });
  },

  onUpdateTags: function onUpdateTags(person, tags) {
    var _this2 = this;

    var body = { _id: person.get('_id'), tags: tags };
    var message = 'Cannot update tags, check your backend server';
    var request = (0, _utils.requestJson)('/api/people/tags', { verb: 'post', body: body, message: message });

    request.then(function (person) {
      state.data = state.data.update(person._id, function (p) {
        return p.set('tags', _immutable2['default'].fromJS(person.tags));
      });
      _this2.trigger(state);
    });
  },

  onCreate: function onCreate(person) {
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/people', { verb: 'post', body: { person: person }, message: 'Cannot create person, check your backend server' }).then(function (person) {
      state.isLoading = false;
      actions.createCompleted.sync = true;
      actions.createCompleted(person);
    });
  },

  onCreateCompleted: function onCreateCompleted(person) {
    state.data = state.data.set(person._id, _immutable2['default'].fromJS(Maker(person)));
    _companies.companiesActions.addPerson(person);
    this.trigger(state);
  },

  onUpdate: function onUpdate(previous, updates) {
    var next = _.assign({}, previous, updates);
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/person', { verb: 'put', body: { person: next }, message: 'Cannot update person, check your backend server' }).then(function (person) {
      state.isLoading = false;
      actions.updateCompleted.sync = true;
      actions.updateCompleted(previous, person);
    });
  },

  onUpdateCompleted: function onUpdateCompleted(previous, person) {
    state.data = state.data.set(person._id, _immutable2['default'].fromJS(Maker(person)));
    if (previous.companyId !== person.companyId) {
      _companies.companiesActions.removePerson(previous);
      _companies.companiesActions.addPerson(person);
    }
    this.trigger(state);
  },

  onDelete: function onDelete(person) {
    var id = person._id;
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/person/' + id, { verb: 'delete', message: 'Cannot delete person, check your backend server' }).then(function (res) {
      state.isLoading = false;
      actions.deleteCompleted.sync = true;
      actions.deleteCompleted(person);
    });
  },

  onDeleteCompleted: function onDeleteCompleted(person) {
    state.data = state.data['delete'](person._id);
    _companies.companiesActions.removePerson(person);
    this.trigger(state);
  }

});

function Maker(doc) {
  doc.createdAt = (0, _moment2['default'])(doc.createdAt);
  if (doc.updatedAt) doc.updatedAt = (0, _moment2['default'])(doc.updatedAt);
  return doc;
}

exports.personsStore = store;
exports.personsActions = actions;
//# sourceMappingURL=persons.js.map
