'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _models = require('../../models');

var _helpers = require('../../helpers');

var _middlewareCheck_user = require('../../middleware/check_user');

var _middlewareCheck_user2 = _interopRequireDefault(_middlewareCheck_user);

var _middlewareCheck_rights = require('../../middleware/check_rights');

var _middlewareCheck_rights2 = _interopRequireDefault(_middlewareCheck_rights);

var _uppercamelcase = require('uppercamelcase');

var _uppercamelcase2 = _interopRequireDefault(_uppercamelcase);

function init(app, resources) {

  app.get('/companies', function (req, res, next) {
    var ids = _lodash2['default'].map(req.query.ids, function (id) {
      return (0, _helpers.ObjectId)(id);
    });
    _async2['default'].waterfall([loadAll.bind(null, ids), _models.Preference.spread.bind(_models.Preference, 'company', req.user), computeBill], function (err, companies) {
      if (err) return next(err);
      res.json(_lodash2['default'].map(companies, function (p) {
        return Maker(p);
      }));
    });
  });

  app.post('/companies/preferred', (0, _middlewareCheck_rights2['default'])('company.update'), function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.body.id);
    var isPreferred = Boolean(req.body.preferred);
    _async2['default'].waterfall([loadOne.bind(null, id), _models.Preference.update.bind(_models.Preference, 'company', req.user, isPreferred)], function (err, company) {
      if (err) return next(err);
      var current = Maker(company);
      current.preferred = isPreferred;
      current.updatedAt = new Date();
      res.json(current);
      resources.reactor.emit('company.update', { previous: company, current: current }, { sessionId: req.sessionId });
    });
  });

  app['delete']('/company/:id', (0, _middlewareCheck_rights2['default'])('company.delete'), function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.params.id);
    _async2['default'].waterfall([del.bind(null, id), _models.Preference['delete'].bind(null, req.user), _models.Note.deleteForOneEntity, findOne], function (err, company) {
      if (err) return next(err);
      res.json({ _id: id, isDeleted: true });
      resources.reactor.emit('company.delete', Maker(company), { sessionId: req.sessionId });
      resources.reactor.emit('notes.entity.delete', Maker(company));
    });
  });

  app.post('/companies', (0, _middlewareCheck_rights2['default'])('company.new'), function (req, res, next) {
    var company = req.body.company;
    var isPreferred = Boolean(req.body.company.preferred);
    var noteContent = req.body.company.note;
    _async2['default'].waterfall([create.bind(null, company), loadOne, _models.Preference.update.bind(_models.Preference, 'company', req.user, isPreferred), _models.Note.create.bind(_models.Note, noteContent, req.user)], function (err, company, note) {
      if (err) return next(err);
      var current = Maker(company);
      res.json(current);
      resources.reactor.emit('company.new', current, { sessionId: req.sessionId });
      if (note) resources.reactor.emit('note.new', note);
    });
  });

  app.put('/company', (0, _middlewareCheck_rights2['default'])('company.update'), function (req, res, next) {
    var updates = fromJson(req.body.company);
    var id = (0, _helpers.ObjectId)(req.body.company._id);
    var isPreferred = Boolean(req.body.company.preferred);
    _async2['default'].waterfall([loadOne.bind(null, id), update.bind(null, updates), function (previous, cb) {
      return loadOne(previous._id, function (err, company) {
        return cb(err, previous, company);
      });
    }, function (previous, company, cb) {
      _models.Preference.update('company', req.user, isPreferred, company, function (err) {
        return cb(err, previous, company);
      });
    }], function (err, previous, company) {
      if (err) return next(err);
      var current = Maker(company);
      current.preferred = isPreferred;
      res.json(current);
      resources.reactor.emit('company.update', { previous: previous, current: current }, { sessionId: req.sessionId });
    });
  });

  app.post('/companies/tags', (0, _middlewareCheck_rights2['default'])('company.update'), function (req, res, next) {
    var tags = req.body.tags;
    var id = (0, _helpers.ObjectId)(req.body._id);
    _async2['default'].waterfall([loadOne.bind(null, id), updateTags.bind(null, tags), function (previous, cb) {
      return loadOne(previous._id, function (err, company) {
        return cb(err, previous, company);
      });
    }], function (err, previous, company) {
      if (err) return next(err);
      var current = Maker(company);
      res.json(current);
      resources.reactor.emit('company.update', { previous: previous, current: current }, { sessionId: req.sessionId });
    });
  });
}

function fromJson(json) {
  var attrs = ['name', 'type', 'preferred', 'website'];
  var res = _lodash2['default'].pick(json, attrs);
  if (json.address) {
    var _attrs = ['street', 'zipcode', 'city', 'country'];
    res.address = _lodash2['default'].pick(json.address, _attrs);
  }

  if (json.avatar) {
    var _attrs2 = ['src', 'url', 'color', 'type'];
    res.avatar = _lodash2['default'].pick(json.avatar, _attrs2);
  }

  if (json.tags) {
    var tags = _lodash2['default'].reduce(json.tags, function (res, tag) {
      var t = (0, _uppercamelcase2['default'])(tag);
      res[t] = t;return res;
    }, {});
    res.tags = _lodash2['default'].chain(tags).values().compact().sort().value();
  }

  //res.updatedAt = new Date();
  if (res.type) res.type = res.type.toLowerCase();
  return res;
}

function computeBill(companies, cb) {
  function setBillElements(company, cb) {
    if ((0, _helpers.getRandomInt)(0, 10) > 6) {
      company.billed = (0, _helpers.getRandomInt)(0, 50000);
      company.billable = (0, _helpers.getRandomInt)(5000, 75000);
    } else {
      company.billed = 0;
      company.billable = 0;
    }
    setImmediate(cb);
  }
  _async2['default'].map(companies, setBillElements, function (err) {
    return cb(err, companies);
  });
}

function loadPersonsCompany(company, cb) {
  var query = {
    companyId: company._id,
    isDeleted: { $ne: true }
  };
  _models.Person.findAll(query, function (err, persons) {
    if (err) return cb(err);
    company.personIds = _lodash2['default'].map(persons, function (p) {
      return p._id;
    });
    cb(null, company);
  });
}

function loadAll(ids, cb) {
  function load(cb) {
    var query = { isDeleted: { $ne: true } };
    if (ids.length) query._id = { $in: ids };
    _models.Company.findAll(query, cb);
  }

  function loadPersons(companies, cb) {
    _async2['default'].map(companies, loadPersonsCompany, cb);
  }

  _async2['default'].waterfall([load, loadPersons], cb);
}

function loadOne(id, cb) {

  function load(cb) {
    _models.Company.findOne(query, function (err, company) {
      if (err) return cb(err);
      if (!company) return cb(new Error('Unknown company: \'' + id + '\''));
      cb(null, company);
    });
  }

  var query = {
    _id: id,
    isDeleted: { $ne: true }
  };

  _async2['default'].waterfall([load, loadPersonsCompany], cb);
}

function create(company, cb) {
  var newCompany = fromJson(company);
  newCompany.createdAt = new Date();
  _models.Company.collection.insertOne(newCompany, function (err, _) {
    //console.log(newCompany);
    return cb(err, newCompany._id);
  });
}

function update(updates, previousCompany, cb) {
  updates.updatedAt = new Date();
  _models.Company.collection.updateOne({ _id: previousCompany._id }, { $set: updates }, function (err) {
    return cb(err, previousCompany);
  });
}

function updateTags(tags, company, cb) {
  _models.Company.collection.updateOne({ _id: company._id }, { $set: { tags: tags } }, function (err) {
    return cb(err, company);
  });
}

function findOne(id, cb) {
  _models.Company.findOne({ _id: id }, function (err, company) {
    if (err) return next(err);
    if (!company) return cb(new Error('Unknown company: \'' + id + '\''));
    cb(null, company);
  });
}

function del(id, cb) {
  _models.Company.collection.updateOne({ _id: id }, { $set: { updatedAt: new Date(), isDeleted: true } }, function (err) {
    return cb(err, id);
  });
}

function Maker(obj) {
  obj.createdAt = obj.createdAt || new Date(1967, 9, 1);
  if (!obj.updatedAt && _moment2['default'].duration((0, _moment2['default'])() - obj.createdAt).asHours() < 2) obj.isNew = true;else if (obj.updatedAt && _moment2['default'].duration((0, _moment2['default'])() - obj.updatedAt).asHours() < 1) obj.isUpdated = true;
  return obj;
}
//# sourceMappingURL=companies.js.map
