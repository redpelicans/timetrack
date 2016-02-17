'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _models = require('../../models');

var _helpers = require('../../helpers');

var _middlewareCheck_rights = require('../../middleware/check_rights');

var _middlewareCheck_rights2 = _interopRequireDefault(_middlewareCheck_rights);

function init(app, resources) {
  app.get('/notes', function (req, res, next) {
    _async2['default'].waterfall([loadAll], function (err, notes) {
      if (err) return next(err);
      res.json(notes);
    });
  });

  // TODO: should check right depending on entity
  app.post('/notes', function (req, res, next) {
    var note = req.body.note;
    _async2['default'].waterfall([create.bind(null, note, req.user), loadOne], function (err, note) {
      if (err) return next(err);
      var current = Maker(note);
      res.json(current);
      resources.reactor.emit('note.new', current, { sessionId: req.sessionId });
    });
  });

  // TODO: should check right depending on entity
  app.put('/note', function (req, res, next) {
    var updates = fromJson(req.body.note);
    updates.authorId = req.user._id;
    var id = (0, _helpers.ObjectId)(req.body.note._id);
    _async2['default'].waterfall([loadOne.bind(null, id), update.bind(null, updates), function (previous, cb) {
      return loadOne(previous._id, function (err, person) {
        return cb(err, previous, person);
      });
    }], function (err, previous, note) {
      if (err) return next(err);
      var current = Maker(note);
      res.json(current);
      resources.reactor.emit('note.update', { previous: previous, current: current }, { sessionId: req.sessionId });
    });
  });

  app['delete']('/note/:id', function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.params.id);
    _async2['default'].waterfall([del.bind(null, id), findOne], function (err, note) {
      if (err) return next(err);
      res.json({ _id: id, isDeleted: true });
      resources.reactor.emit('note.delete', Maker(note), { sessionId: req.sessionId });
    });
  });
}

function loadAll(cb) {
  _models.Note.findAll({ isDeleted: { $ne: true } }, cb);
}

function findOne(id, cb) {
  _models.Note.findOne({ _id: id }, function (err, note) {
    if (err) return next(err);
    if (!note) return cb(new Error('Unknown note: \'' + id + '\''));
    cb(null, note);
  });
}

function loadOne(id, cb) {
  _models.Note.loadOne(id, function (err, note) {
    if (err) return next(err);
    if (!note) return cb(new Error('Unknown note: \'' + id + '\''));
    cb(null, note);
  });
}

function create(note, user, cb) {
  var newNote = fromJson(note);
  newNote.authorId = user._id;
  newNote.createdAt = new Date();
  _models.Note.collection.insertOne(newNote, function (err, _) {
    return cb(err, newNote._id);
  });
}

function update(updates, previousNote, cb) {
  updates.updatedAt = new Date();
  _models.Note.collection.updateOne({ _id: previousNote._id }, { $set: updates }, function (err) {
    return cb(err, previousNote);
  });
}

function del(id, cb) {
  _models.Note.collection.updateOne({ _id: id }, { $set: { updatedAt: new Date(), isDeleted: true } }, function (err) {
    return cb(err, id);
  });
}

function Maker(obj) {
  return obj;
}

function fromJson(json) {
  var attrs = ['content'];
  var res = _lodash2['default'].pick(json, attrs);
  if (json.entityId) res.entityId = (0, _helpers.ObjectId)(json.entityId);
  return res;
}
//# sourceMappingURL=notes.js.map
