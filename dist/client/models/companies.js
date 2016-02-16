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

var actions = _reflux2['default'].createActions(["load", "reload", "delete", "deleteCompleted", "create", "createCompleted", "update", "updateCompleted", "updateTags", "leave", "addPerson", "removePerson", "updateRelations", "loadCompleted", "togglePreferred"]);

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
    var _ref$ids = _ref.ids;
    var ids = _ref$ids === undefined ? [] : _ref$ids;

    var objs = _.map(ids, function (id) {
      return state.data.get(id);
    });
    var doRequest = forceReload || !_.all(objs) || !state.data.size;

    if (!doRequest) return actions.loadCompleted(state.data);

    var url = '/api/companies';

    console.log("start loading companies ...");
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)(url, { message: 'Cannot load companies, check your backend server' }).then(function (companies) {
      console.log("end loading companies ...");
      actions.loadCompleted.sync = true;
      actions.loadCompleted(_immutable2['default'].fromJS(_.chain(companies).map(function (p) {
        return [p._id, Maker(p)];
      }).object().value()));
    });
  },

  onAddPerson: function onAddPerson(person) {
    if (!person.companyId) return;
    state.data = state.data.update(person.companyId, function (c) {
      return c.update('personIds', function (ids) {
        return ids.push(person._id);
      });
    });
    this.trigger(state);
  },

  onRemovePerson: function onRemovePerson(person) {
    if (!person.companyId) return;
    state.data = state.data.update(person.companyId, function (c) {
      var index = c.get('personIds').findIndex(function (id) {
        return id === person._id;
      });
      // send error
      if (index === -1) return c;
      return c.update('personIds', function (ids) {
        return ids['delete'](index);
      });
    });
    this.trigger(state);
  },

  onLeave: function onLeave(company, person) {
    _persons.personsActions.update(person.toJS(), person.set('companyId', undefined).toJS());
  },

  onReload: function onReload(ids) {},

  onLoadCompleted: function onLoadCompleted(data) {
    state.data = data;
    state.isLoading = false;
    this.trigger(state);
  },

  onCreate: function onCreate(company) {
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/companies', { verb: 'post', body: { company: company }, message: 'Cannot create company, check your backend server' }).then(function (company) {
      state.isLoading = false;
      actions.createCompleted.sync = true;
      actions.createCompleted(company);
    });
  },

  onCreateCompleted: function onCreateCompleted(company) {
    state.data = state.data.set(company._id, _immutable2['default'].fromJS(Maker(company)));
    this.trigger(state);
  },

  onUpdateTags: function onUpdateTags(company, tags) {
    var _this = this;

    var body = { _id: company.get('_id'), tags: tags };
    var message = 'Cannot update tags, check your backend server';
    var request = (0, _utils.requestJson)('/api/companies/tags', { verb: 'post', body: body, message: message });

    request.then(function (company) {
      state.data = state.data.update(company._id, function (p) {
        return p.set('tags', _immutable2['default'].fromJS(company.tags));
      });
      _this.trigger(state);
    });
  },

  onUpdate: function onUpdate(previous, updates) {
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/company', { verb: 'put', body: { company: _.assign(previous, updates) }, message: 'Cannot update company, check your backend server' }).then(function (company) {
      state.isLoading = false;
      actions.updateCompleted.sync = true;
      actions.updateCompleted(previous, company);
    });
  },

  onUpdateCompleted: function onUpdateCompleted(previous, company) {
    state.data = state.data.set(company._id, _immutable2['default'].fromJS(Maker(company)));
    this.trigger(state);
  },

  onUpdateRelations: function onUpdateRelations(ids) {
    var companyIds = _.chain(ids).compact().uniq().value();
    actions.load({ ids: companyIds, forceReload: true });
  },

  onDelete: function onDelete(company) {
    var id = company._id;
    state.isLoading = true;
    this.trigger(state);
    (0, _utils.requestJson)('/api/company/' + id, { verb: 'delete', message: 'Cannot delete company, check your backend server' }).then(function (res) {
      state.isLoading = false;
      actions.deleteCompleted.sync = true;
      actions.deleteCompleted(company);
    });
  },

  onDeleteCompleted: function onDeleteCompleted(company) {
    state.data = state.data['delete'](company._id);
    this.trigger(state);
  },

  onTogglePreferred: function onTogglePreferred(company) {
    var _this2 = this;

    var body = { id: company.get('_id'), preferred: !company.get('preferred') };
    var message = 'Cannot toggle preferred status, check your backend server';
    var request = (0, _utils.requestJson)('/api/companies/preferred', { verb: 'post', body: body, message: message });
    state.isLoading = true;
    this.trigger(state);

    request.then(function (res) {
      state.data = state.data.update(res._id, function (p) {
        return p.set('preferred', body.preferred);
      });
      state.isLoading = false;
      _this2.trigger(state);
    });
  }
});

function Maker(doc) {
  doc.createdAt = (0, _moment2['default'])(doc.createdAt);
  if (doc.updatedAt) doc.updatedAt = (0, _moment2['default'])(doc.updatedAt);
  return doc;
}

exports.companiesStore = store;
exports.companiesActions = actions;
//# sourceMappingURL=companies.js.map
