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
    _async2['default'].waterfall([loadAll, _models.Preference.spread.bind(_models.Preference, 'person', req.user)], function (err, people) {
      if (err) return next(err);
      res.json(_lodash2['default'].map(people, function (p) {
        return Maker(p);
      }));
    });
  });

  app.post('/people/preferred', (0, _middlewareCheck_rights2['default'])('person.update'), function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.body.id);
    var isPreferred = Boolean(req.body.preferred);
    _async2['default'].waterfall([loadOne.bind(null, id), _models.Preference.update.bind(_models.Preference, 'person', req.user, isPreferred)], function (err, person) {
      if (err) return next(err);
      var current = Maker(person);
      current.preferred = isPreferred;
      current.updatedAt = new Date();
      res.json(current);
      resources.reactor.emit('person.update', { previous: person, current: current }, { sessionId: req.sessionId });
    });
  });

  app['delete']('/person/:id', (0, _middlewareCheck_rights2['default'])('person.delete'), function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.params.id);
    _async2['default'].waterfall([del.bind(null, id), _models.Preference['delete'].bind(null, req.user), _models.Note.deleteForOneEntity, // TODO: should emit note.delete
    findOne], function (err, person) {
      if (err) return next(err);
      res.json({ _id: id, isDeleted: true });
      resources.reactor.emit('person.delete', Maker(person), { sessionId: req.sessionId });
      resources.reactor.emit('notes.entity.delete', Maker(person));
    });
  });

  app.post('/people', (0, _middlewareCheck_rights2['default'])('person.new'), function (req, res, next) {
    var person = req.body.person;
    var isPreferred = Boolean(req.body.person.preferred);
    var noteContent = req.body.person.note;
    _async2['default'].waterfall([create.bind(null, person), loadOne, _models.Preference.update.bind(_models.Preference, 'person', req.user, isPreferred), _models.Note.create.bind(_models.Note, noteContent, req.user)], function (err, person, note) {
      if (err) return next(err);
      var current = Maker(person);
      current.preferred = isPreferred;
      res.json(current);
      resources.reactor.emit('person.new', current, { sessionId: req.sessionId });
      if (note) resources.reactor.emit('note.new', note);
    });
  });

  app.post('/people/tags', (0, _middlewareCheck_rights2['default'])('person.update'), function (req, res, next) {
    var tags = req.body.tags;
    var id = (0, _helpers.ObjectId)(req.body._id);
    _async2['default'].waterfall([loadOne.bind(null, id), updateTags.bind(null, tags), function (previous, cb) {
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

  app.put('/person', (0, _middlewareCheck_rights2['default'])('person.update'), function (req, res, next) {
    var updates = fromJson(req.body.person);
    var id = (0, _helpers.ObjectId)(req.body.person._id);
    var isPreferred = Boolean(req.body.person.preferred);
    _async2['default'].waterfall([loadOne.bind(null, id), update.bind(null, updates), function (previous, cb) {
      return loadOne(previous._id, function (err, person) {
        return cb(err, previous, person);
      });
    }, function (previous, person, cb) {
      _models.Preference.update('person', req.user, isPreferred, person, function (err) {
        return cb(err, previous, person);
      });
    }], function (err, previous, person) {
      if (err) return next(err);
      var current = Maker(person);
      current.preferred = isPreferred;
      res.json(current);
      resources.reactor.emit('person.update', { previous: previous, current: current }, { sessionId: req.sessionId });
    });
  });

  app.post('/person/check_email_uniqueness', (0, _middlewareCheck_user2['default'])('admin'), function (req, res, next) {
    var email = req.body.email && req.body.email.trim();
    _models.Person.findAll({ email: email, isDeleted: { $ne: true } }, { _id: 1 }, function (err, data) {
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
    return cb(err, newPerson._id);
  });
}

function update(updates, previousPerson, cb) {
  updates.updatedAt = new Date();
  _models.Person.collection.updateOne({ _id: previousPerson._id }, { $set: updates }, function (err) {
    return cb(err, previousPerson);
  });
}

function updateTags(tags, person, cb) {
  _models.Person.collection.updateOne({ _id: person._id }, { $set: { tags: tags } }, function (err) {
    return cb(err, person);
  });
}

function del(id, cb) {
  _models.Person.collection.updateOne({ _id: id }, { $set: { updatedAt: new Date(), isDeleted: true } }, function (err) {
    return cb(err, id);
  });
}

function fromJson(json) {
  var attrs = ['prefix', 'firstName', 'lastName', 'type', 'jobType', 'jobDescription', 'department', 'roles', 'email', 'birthdate', 'note'];
  var res = _lodash2['default'].pick(json, attrs);
  res.companyId = json.companyId ? (0, _helpers.ObjectId)(json.companyId) : undefined;
  if (res.type !== 'worker') res.roles = undefined;
  if (res.type === 'worker' && json.skills) {
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
  if (json.tags) {
    var tags = _lodash2['default'].reduce(json.tags, function (res, tag) {
      var t = (0, _uppercamelcase2['default'])(tag);
      res[t] = t;return res;
    }, {});
    res.tags = _lodash2['default'].chain(tags).values().compact().sort().value();
  }
  //res.updatedAt = new Date();
  return res;
}

function Maker(person) {
  person.name = person.fullName();
  person.createdAt = person.createdAt || new Date(1967, 9, 1);
  if (!person.updatedAt && _moment2['default'].duration((0, _moment2['default'])() - person.createdAt).asHours() < 2) person.isNew = true;else if (person.updatedAt && _moment2['default'].duration((0, _moment2['default'])() - person.updatedAt).asHours() < 1) person.isUpdated = true;
  return person;
}
//# sourceMappingURL=people.js.map
