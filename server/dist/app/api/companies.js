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

function init(app, resources) {
  app.get('/companies', function (req, res, next) {
    var ids = _lodash2['default'].map(req.query.ids, function (id) {
      return (0, _helpers.ObjectId)(id);
    });
    _async2['default'].waterfall([loadAll.bind(null, ids), computeBill], function (err, companies) {
      if (err) return next(err);
      res.json(_lodash2['default'].map(companies, function (p) {
        return Maker(p);
      }));
    });
  });

  app.get('/company/:id', function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.params.id);
    _async2['default'].waterfall([loadOne.bind(null, id)], function (err, company) {
      if (err) return next(err);
      res.json(Maker(company));
    });
  });

  app['delete']('/company/:id', (0, _middlewareCheck_rights2['default'])('company.delete'), function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.params.id);
    _async2['default'].waterfall([del.bind(null, id), findOne], function (err, company) {
      if (err) return next(err);
      res.json({ _id: id, isDeleted: true });
      resources.reactor.emit('company.delete', Maker(company), { sessionId: req.sessionId });
    });
  });

  app.post('/companies/preferred', (0, _middlewareCheck_user2['default'])('admin'), function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.body.id);
    _async2['default'].waterfall([loadOne.bind(null, id), preferred.bind(null, Boolean(req.body.preferred))], function (err, company) {
      if (err) return next(err);
      res.json(Maker(company));
    });
  });

  app.post('/companies', (0, _middlewareCheck_rights2['default'])('company.new'), function (req, res, next) {
    var company = req.body.company;
    _async2['default'].waterfall([create.bind(null, company), loadOne], function (err, company) {
      if (err) return next(err);
      var c = Maker(company);
      res.json(c);
      resources.reactor.emit('company.new', c, { sessionId: req.sessionId });
    });
  });

  app.put('/company', (0, _middlewareCheck_rights2['default'])('company.update'), function (req, res, next) {
    var newCompany = req.body.company;
    var id = (0, _helpers.ObjectId)(newCompany._id);
    _async2['default'].waterfall([loadOne.bind(null, id), update.bind(null, newCompany), function (previous, cb) {
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
  var attrs = ['name', 'type', 'preferred', 'website', 'note'];
  var res = _lodash2['default'].pick(json, attrs);
  if (json.address) {
    var _attrs = ['street', 'zipcode', 'city', 'country'];
    res.address = _lodash2['default'].pick(json.address, _attrs);
  }
  if (json.avatar) {
    var _attrs2 = ['src', 'url', 'color', 'type'];
    res.avatar = _lodash2['default'].pick(json.avatar, _attrs2);
  }
  res.updatedAt = new Date();
  res.type = res.type.toLowerCase();
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

function update(newCompany, previousCompany, cb) {
  var updates = fromJson(newCompany);
  _models.Company.collection.updateOne({ _id: previousCompany._id }, { $set: updates }, function (err) {
    return cb(err, previousCompany);
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
  _models.Company.collection.updateOne({ _id: id }, { $set: { isDeleted: true } }, function (err) {
    return cb(err, id);
  });
}

function preferred(isPreferred, company, cb) {
  company.preferred = isPreferred;
  _models.Company.collection.update({ _id: company._id }, { $set: { preferred: company.preferred } }, function (err) {
    cb(err, company);
  });
}

function Maker(obj) {
  obj.isNew = _moment2['default'].duration((0, _moment2['default'])() - obj.createdAt).asDays() < 1;
  return obj;
}
//# sourceMappingURL=companies.js.map
