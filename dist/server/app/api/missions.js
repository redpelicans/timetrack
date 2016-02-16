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

var _middlewareCheck_rights = require('../../middleware/check_rights');

var _middlewareCheck_rights2 = _interopRequireDefault(_middlewareCheck_rights);

function init(app, resources) {
  app.get('/missions', function (req, res, next) {
    _async2['default'].waterfall([loadAll], function (err, missions) {
      if (err) return next(err);
      res.json(_lodash2['default'].map(missions, function (m) {
        return Maker(m);
      }));
    });
  });

  app.post('/missions', (0, _middlewareCheck_rights2['default'])('mission.new'), function (req, res, next) {
    var mission = req.body.mission;
    var noteContent = req.body.mission.note;
    _async2['default'].waterfall([create.bind(null, mission), loadOne, _models.Note.create.bind(_models.Note, noteContent, req.user)], function (err, mission, note) {
      if (err) return next(err);
      var current = Maker(mission);
      res.json(current);
      resources.reactor.emit('mission.new', current, { sessionId: req.sessionId });
      if (note) resources.reactor.emit('note.new', note);
    });
  });

  app.put('/mission', (0, _middlewareCheck_rights2['default'])('mission.update'), function (req, res, next) {
    var updates = fromJson(req.body.mission);
    var id = (0, _helpers.ObjectId)(req.body.mission._id);
    _async2['default'].waterfall([loadOne.bind(null, id), update.bind(null, updates), function (previous, cb) {
      return loadOne(previous._id, function (err, mission) {
        return cb(err, previous, mission);
      });
    }], function (err, previous, mission) {
      if (err) return next(err);
      var current = Maker(mission);
      res.json(current);
      resources.reactor.emit('mission.update', { previous: previous, current: current }, { sessionId: req.sessionId });
    });
  });

  app['delete']('/mission/:id', (0, _middlewareCheck_rights2['default'])('mission.delete'), function (req, res, next) {
    var id = (0, _helpers.ObjectId)(req.params.id);
    _async2['default'].waterfall([del.bind(null, id), _models.Note.deleteForOneEntity, // TODO: should emit note.delete
    findOne], function (err, mission) {
      if (err) return next(err);
      res.json({ _id: id, isDeleted: true });
      resources.reactor.emit('mission.delete', Maker(mission), { sessionId: req.sessionId });
      resources.reactor.emit('notes.entity.delete', Maker(mission));
    });
  });
}

function loadAll(cb) {
  _models.Mission.findAll({ isDeleted: { $ne: true } }, cb);
}

function loadOne(id, cb) {
  _models.Mission.loadOne(id, function (err, mission) {
    if (err) return next(err);
    if (!mission) return cb(new Error('Unknown mission: \'' + id + '\''));
    cb(null, mission);
  });
}

function findOne(id, cb) {
  _models.Mission.findOne({ _id: id }, function (err, mission) {
    if (err) return next(err);
    if (!mission) return cb(new Error('Unknown mission: \'' + id + '\''));
    cb(null, mission);
  });
}

function create(mission, cb) {
  var newMission = fromJson(mission);
  newMission.createdAt = new Date();
  _models.Mission.collection.insertOne(newMission, function (err, _) {
    return cb(err, newMission._id);
  });
}

function update(updates, previousMission, cb) {
  updates.updatedAt = new Date();
  _models.Mission.collection.updateOne({ _id: previousMission._id }, { $set: updates }, function (err) {
    return cb(err, previousMission);
  });
}

function del(id, cb) {
  var updates = {
    isDeleted: true,
    updatedAt: new Date()
  };
  _models.Mission.collection.updateOne({ _id: id }, { $set: updates }, function (err) {
    return cb(err, id);
  });
}

function fromJson(json) {
  //console.log(json);
  var attrs = ['name', 'note', 'status', 'timesheetUnit', 'allowWeekends'];
  var res = _lodash2['default'].pick(json, attrs);
  if (res.status !== 'closed') res.status = 'open';
  if (json.startDate) res.startDate = (0, _moment2['default'])(json.startDate).toDate();
  if (json.endDate) res.endDate = (0, _moment2['default'])(json.endDate).toDate();
  res.clientId = json.clientId ? (0, _helpers.ObjectId)(json.clientId) : undefined;
  res.managerId = json.managerId ? (0, _helpers.ObjectId)(json.managerId) : undefined;
  if (json.workerIds) {
    res.workerIds = _lodash2['default'].chain(json.workerIds).compact().map(_helpers.ObjectId).value();
  }
  //res.updatedAt = new Date();
  return res;
}

function Maker(mission) {
  mission.createdAt = mission.createdAt || new Date(1967, 9, 1);
  if (!mission.updatedAt && _moment2['default'].duration((0, _moment2['default'])() - mission.createdAt).asHours() < 2) mission.isNew = true;else if (mission.updatedAt && _moment2['default'].duration((0, _moment2['default'])() - mission.updatedAt).asHours() < 1) mission.isUpdated = true;
  mission.isClosed = mission.status === 'closed';
  return mission;
}
//# sourceMappingURL=missions.js.map
