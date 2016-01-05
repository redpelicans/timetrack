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
  app.get('/people', function (req, res, next) {
    _async2['default'].waterfall([loadAll], function (err, people) {
      if (err) return next(err);
      res.json(_lodash2['default'].map(people, function (p) {
        return Maker(p);
      }));
    });
  });

  app.post('/people/preferred', (0, _middlewareCheck_rights2['default'])('person.update'), function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.body.id);
    _async2['default'].waterfall([loadOne.bind(null, id), preferred.bind(null, Boolean(req.body.preferred))], function (err, previous, person) {
      if (err) return next(err);
      var current = Maker(person);
      res.json(Maker(current));
      resources.reactor.emit('person.update', { previous: previous, current: current }, { sessionId: req.sessionId });
    });
  });

  app['delete']('/person/:id', (0, _middlewareCheck_rights2['default'])('person.delete'), function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.params.id);
    _async2['default'].waterfall([del.bind(null, id), findOne], function (err, person) {
      if (err) return next(err);
      res.json({ _id: id, isDeleted: true });
      resources.reactor.emit('person.delete', Maker(person), { sessionId: req.sessionId });
    });
  });

  app.post('/people', (0, _middlewareCheck_rights2['default'])('person.new'), function (req, res, next) {
    var person = req.body.person;
    _async2['default'].waterfall([create.bind(null, person), loadOne], function (err, person) {
      if (err) return next(err);
      var p = Maker(person);
      res.json(p);
      resources.reactor.emit('person.new', p, { sessionId: req.sessionId });
    });
  });

  app.put('/person', (0, _middlewareCheck_rights2['default'])('person.update'), function (req, res, next) {
    var newPerson = req.body.person;
    var id = (0, _helpers.ObjectId)(newPerson._id);
    _async2['default'].waterfall([loadOne.bind(null, id), update.bind(null, newPerson), function (previous, cb) {
      return loadOne(previous._id, function (err, person) {
        return cb(err, previous, person);
      });
    }], function (err, previous, person) {
      if (err) return next(err);
      var current = Maker(person);
      res.json(current);
      resources.reactor.emit('person.update', { previous: previous, current: current }, { sessionId: req.sessionId });
    });
  });

  app.post('/person/check_email_uniqueness', (0, _middlewareCheck_user2['default'])('admin'), function (req, res, next) {
    var email = req.body.email && req.body.email.trim();
    _models.Person.findAll({ email: email }, { _id: 1 }, function (err, data) {
      if (err) return next(err);
      if (data.length) return res.json({ email: email, ok: false });
      res.json({ email: email, ok: true });
    });
  });
}

function loadAll(cb) {
  _models.Person.findAll({ isDeleted: { $ne: true } }, cb);
}

function findOne(id, cb) {
  _models.Person.findOne({ _id: id }, function (err, person) {
    if (err) return next(err);
    if (!person) return cb(new Error('Unknown person: \'' + id + '\''));
    cb(null, person);
  });
}

function loadOne(id, cb) {
  _models.Person.loadOne(id, function (err, person) {
    if (err) return next(err);
    if (!person) return cb(new Error('Unknown person: \'' + id + '\''));
    cb(null, person);
  });
}

function create(person, cb) {
  var newPerson = fromJson(person);
  newPerson.createdAt = new Date();
  _models.Person.collection.insertOne(newPerson, function (err, _) {
    //console.log(newPerson);
    return cb(err, newPerson._id);
  });
}

function update(newPerson, previousPerson, cb) {
  var updates = fromJson(newPerson);
  _models.Person.collection.updateOne({ _id: previousPerson._id }, { $set: updates }, function (err) {
    return cb(err, previousPerson);
  });
}

function del(id, cb) {
  _models.Person.collection.updateOne({ _id: id }, { $set: { isDeleted: true } }, function (err) {
    return cb(err, id);
  });
}

function preferred(isPreferred, person, cb) {
  person.preferred = isPreferred;
  _models.Person.collection.update({ _id: person._id }, { $set: { preferred: person.preferred } }, function (err) {
    // TODO: exec loadOne to retreive new updated person instead of updating previous one.
    cb(err, person, person);
  });
}

function fromJson(json) {
  var attrs = ['prefix', 'firstName', 'lastName', 'type', 'jobType', 'preferred', 'jobDescription', 'department', 'roles', 'email', 'birthdate', 'note'];
  var res = _lodash2['default'].pick(json, attrs);
  res.companyId = json.companyId ? (0, _helpers.ObjectId)(json.companyId) : undefined;
  if (json.skills) {
    res.skills = _lodash2['default'].chain(json.skills).compact().map(function (skill) {
      return (0, _uppercamelcase2['default'])(skill);
    }).sort().value();
  }
  if (json.phones) {
    (function () {
      var attrs = ['label', 'number'];
      res.phones = _lodash2['default'].chain(json.phones).filter(function (p) {
        return p.number;
      }).map(function (p) {
        return _lodash2['default'].pick(p, attrs);
      }).value();
    })();
  }
  if (json.avatar) {
    var _attrs = ['src', 'url', 'color', 'type'];
    res.avatar = _lodash2['default'].pick(json.avatar, _attrs);
  }
  res.updatedAt = new Date();
  return res;
}

function Maker(person) {
  person.name = [person.firstName, person.lastName].join(' ');
  person.isNew = _moment2['default'].duration((0, _moment2['default'])() - person.createdAt).asDays() < 1;
  return person;
}
//# sourceMappingURL=people.js.map
