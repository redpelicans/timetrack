'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.loadOrCreate = loadOrCreate;
exports.findOne = findOne;
exports.loadAll = loadAll;
exports.load = load;
exports.addEvent = addEvent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _rethinkdb = require('rethinkdb');

var _rethinkdb2 = _interopRequireDefault(_rethinkdb);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _models = require('../models');

var _helpers = require('../helpers');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var logerror = (0, _debug2['default'])('transac:error'),
    loginfo = (0, _debug2['default'])('transac:info');

function loadOrCreate(conn, options, cb) {
  findOne(conn, options, function (err, transac) {
    if (err) return cb(err);
    if (!transac) return insertOne(conn, options, null, cb);
    if (transac.isLocked()) return cb(new _helpers.TransacError('Transaction already locked', 'locked'));
    if (transac.isCompound() && options.compound) return insertOne(conn, options, transac, cb);
    insertOne(conn, options, null, cb);
  });
}

// export to be tested

function findOne(conn, options, cb) {
  var query = _rethinkdb2['default'].table(_models.Transac.collection).filter(_rethinkdb2['default'].row.hasFields('parentId').not()).filter({ label: options.label, type: 'transac' });

  if (options.valueDate) {
    (function () {
      var from = (0, _moment2['default'])(options.valueDate).startOf('day').toDate(),
          to = (0, _moment2['default'])(options.valueDate).endOf('day').toDate();

      query = query.filter(function (t) {
        return t('valueDate').during(from, to, { leftBound: "closed", rightBound: "closed" });
      });
    })();
  }

  if (options.compound) query = query.orderBy(_rethinkdb2['default'].asc('createdAt'));else query = query.orderBy(_rethinkdb2['default'].desc('createdAt'));

  query.run(conn, function (err, cursor) {
    if (err) return cb(err);
    cursor.toArray(function (err, transacs) {
      if (err) return cb(err);
      var transac = transacs[0];
      if (!transac) return cb();
      cb(null, (0, _models.bless)(transac));
    });
  });
}

function loadAll(conn, _x, cb) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var label = _ref.label;
  var _ref$from = _ref.from;
  var from = _ref$from === undefined ? (0, _moment2['default'])().startOf('day').toDate() : _ref$from;
  var _ref$to = _ref.to;
  var to = _ref$to === undefined ? (0, _moment2['default'])().endOf('day').toDate() : _ref$to;
  var _ref$dateMode = _ref.dateMode;
  var dateMode = _ref$dateMode === undefined ? 'valueDate' : _ref$dateMode;

  function findAll(cb) {
    var query = _rethinkdb2['default'].table(_models.Transac.collection).filter(_rethinkdb2['default'].row(dateMode === 'valueDate' ? 'valueDate' : 'createdAt').during(from, to, { leftBound: "closed", rightBound: "closed" }));
    if (label) query = query.filter({ label: label });

    query.run(conn, function (err, cursor) {
      if (err) return cb(err);
      cursor.toArray(function (err, transacs) {
        if (err) return cb(err);
        var transacIds = _lodash2['default'].inject(transacs, function (res, transac) {
          res[transac.transacId] = transac.transacId;return res;
        }, {});
        cb(null, _lodash2['default'].keys(transacIds));
      });
    });
  }
  function loadTransacs(transacIds, cb) {
    _async2['default'].map(transacIds, load.bind(null, conn), cb);
  }

  _async2['default'].waterfall([findAll, loadTransacs], cb);
}

function loadRoot(conn, id, cb) {
  _rethinkdb2['default'].table(_models.Transac.collection).filter({ transacId: id }).filter(_rethinkdb2['default'].row.hasFields('parentId').not()).run(conn, function (err, cursor) {
    if (err) return cb(err);
    cursor.toArray(function (err, nodes) {
      if (err) return cb(err);
      cb(null, (0, _models.bless)(nodes[0]));
    });
  });
}

function load(conn, id, cb) {
  _rethinkdb2['default'].table(_models.Transac.collection).filter({ transacId: id }).orderBy(_rethinkdb2['default'].asc('createdAt')).run(conn, function (err, cursor) {
    if (err) return cb(err);
    cursor.toArray(function (err, nodes) {
      if (err) return cb(err);
      var root = undefined,
          hnodes = _lodash2['default'].inject(nodes, function (res, node) {
        res[node.id] = (0, _models.bless)(node);return res;
      }, {});

      _lodash2['default'].each(nodes, function (node) {
        var tnode = hnodes[node.id];
        if (!tnode.parentId) {
          root = tnode;
        } else {
          var _parent = hnodes[tnode.parentId];
          if (!_parent) {
            return cb(new Error("Wrong Transac Tree"));
          }
          _parent.addChild(tnode);
        }
      });
      loginfo('helper.transac.load');
      cb(null, root);
    });
  });
}

function insertOne(conn, options, root, cb) {
  if (!options.compound) {
    (function () {
      var transac = new _models.Transac(options);
      _rethinkdb2['default'].table(_models.Transac.collection).insert(transac, { returnChanges: true }).run(conn, function (err, res) {
        if (err) return cb(err);
        cb(null, transac);
      });
    })();
  } else {
    var transacs = undefined;
    if (options.compound && !root) {
      root = new _models.Transac(options);
      transacs = [root, new _models.Transac(_lodash2['default'].merge({ transacId: root.id, parentId: root.id }, options))];
    } else {
      options.transacId = root.transacId;
      options.parentId = root.id;
      transacs = [new _models.Transac(options)];
    }
    _rethinkdb2['default'].table(_models.Transac.collection).insert(transacs, { returnChanges: true }).run(conn, function (err, res) {
      if (err) return cb(err);
      cb(null, root);
    });
  }
}

function addEvent(conn, id, options, cb) {
  loginfo('helper.transac.addEvent ...');
  _async2['default'].waterfall([loadRoot.bind(null, conn, id), function (transac, cb) {
    if (!transac) return setImmediate(cb, new Error("Unknown transaction"));
    if (!transac.isCompound()) return setImmediate(cb, null, transac);
    load(conn, id, cb);
  }, function (transac, cb) {
    var targetTransac = transac.isCompound() ? transac.lastChild : transac,
        recipe = options.label ? [addEventTransac(conn, targetTransac, options), addMessages.bind(null, conn, targetTransac, options)] : [addMessages.bind(null, conn, targetTransac, options, targetTransac)];
    _async2['default'].waterfall(recipe, function (err) {
      loginfo('helper.transac.addEvent done');
      cb(err, transac);
    });
  }], cb);
}

function addEventTransac(conn, transac, options) {
  return function (cb) {
    try {
      (function () {
        options.transacId = transac.transacId;
        var event = new _models.Event(options);
        transac.addEvent(event);
        _rethinkdb2['default'].table(_models.Transac.collection).insert(event, { returnChanges: true }).run(conn, { durability: 'soft' }, function (err, res) {
          if (err) return cb(err);
          loginfo('helper.transac.addEventTransac done');
          cb(null, event);
        });
      })();
    } catch (e) {
      setImmediate(cb, e);
    }
  };
}

function addMessages(conn, transac, options, parent, cb) {
  try {
    var messages = _lodash2['default'].map(options.messages, function (message) {
      return new _models.Message({ label: message, level: options.level, transacId: transac.transacId });
    });
    _lodash2['default'].each(messages, function (message) {
      return parent.addChild(message);
    });
    _rethinkdb2['default'].table(_models.Transac.collection).insert(messages, { returnChanges: true }).run(conn, { durability: 'soft' }, function (err, res) {
      if (err) return cb(err);
      loginfo('helper.transac.addMessages done');
      cb(null, transac);
    });
  } catch (e) {
    setImmediate(cb, e);
  }
}
//# sourceMappingURL=../helpers/transac.js.map