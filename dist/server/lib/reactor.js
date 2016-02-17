'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = Reactor;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _events = require('events');

var _models = require('../models');

var _rights = require('../rights');

var _rights2 = _interopRequireDefault(_rights);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var logerror = (0, _debug2['default'])('timetrack:error'),
    loginfo = (0, _debug2['default'])('timetrack:info');

var Register = (function () {
  function Register(options) {
    _classCallCheck(this, Register);

    this.connections = {};
    this.options = options;
  }

  _createClass(Register, [{
    key: 'get',
    value: function get(socket) {
      return this.connections[socket.id];
    }
  }, {
    key: 'add',
    value: function add(socket, token, sessionId, cb) {
      var _this = this;

      if (!token) return setImmediate(cb, 'Wrong token');
      _models.Person.getFromToken(token, this.options.secretKey, function (err, user) {
        if (err) cb(err);
        _this.connections[socket.id] = { token: token, sessionId: sessionId, socket: socket, user: user };
        cb(null, _this.connections[socket.id]);
      });
    }
  }, {
    key: 'remove',
    value: function remove(socket) {
      var subscription = this.get(socket);
      if (!subscription) return console.error("Cannot find subscription");
      if (!subscription.user) return;
      loginfo('User ' + subscription.user.fullName() + ' disconnected from socket.io.');
      delete this.connections[socket.id];
    }
  }, {
    key: 'getAuthorizedRegistrations',
    value: function getAuthorizedRegistrations(right, cb) {
      var _this2 = this;

      _async2['default'].map(_lodash2['default'].values(this.connections), function (registration, cb) {
        _models.Person.getFromToken(registration.token, _this2.options.secretKey, function (err, user) {
          if (err) cb(null, null);
          registration.user = user;
          cb(null, registration);
        });
      }, function (err, registrations) {
        if (err) return cb(err);
        cb(null, _lodash2['default'].chain(registrations).compact().filter(function (r) {
          return r.user.hasAllRoles(_rights2['default'][right]);
        }).value());
      });
    }
  }]);

  return Register;
})();

var Dispatcher = (function (_EventEmitter) {
  _inherits(Dispatcher, _EventEmitter);

  function Dispatcher() {
    _classCallCheck(this, Dispatcher);

    _get(Object.getPrototypeOf(Dispatcher.prototype), 'constructor', this).call(this);
  }

  return Dispatcher;
})(_events.EventEmitter);

function ping(socket, data, cb) {
  var subscription = this.subscriptions.get(socket);
  if (subscription) {
    return cb('pong');
  } else {
    this.subscriptions.add(socket, data.token, data.sessionId, function (err, subscription) {
      if (err) return cb({ status: 'error', error: err });
      loginfo('User ' + subscription.user.fullName() + ' connected from socket.io.');
      cb('pong');
    });
  }
}

function login(socket, data, cb) {
  this.subscriptions.add(socket, data.token, data.sessionId, function (err, subscription) {
    if (err) return cb({ status: 'error', error: err });
    loginfo('User ' + subscription.user.fullName() + ' connected from socket.io.');
    cb({ status: 'ok' });
  });
}

function logout(socket) {
  this.subscriptions.remove(socket);
}

var Server = (function () {
  function Server(io, register) {
    _classCallCheck(this, Server);

    this.io = io;
    this.subscriptions = register;
    this.init();
  }

  _createClass(Server, [{
    key: 'init',
    value: function init() {
      var _this3 = this;

      this.io.on('connection', function (socket) {
        loginfo("Socket.IO connection");
        socket.on('disconnect', function () {
          return _this3.subscriptions.remove(socket);
        });
        _this3.registerCallback('ping', ping, socket);
        _this3.registerCallback('login', login, socket);
        _this3.registerCallback('logout', logout, socket);
      });
    }
  }, {
    key: 'registerCallback',
    value: function registerCallback(name, fct, socket) {
      socket.on(name, fct.bind(this, socket));
    }
  }, {
    key: 'broadcast',
    value: function broadcast(event, conf) {
      var server = this;
      return function (data, params) {
        server.subscriptions.getAuthorizedRegistrations(conf.right, function (err, registrations) {
          if (err) console.error(err);
          if (!conf.callback) return server.emit(event, data, registrations, params);
          conf.callback(event, registrations, server.emit.bind(server), data, params);
        });
      };
    }
  }, {
    key: 'emit',
    value: function emit(event, data, registrations) {
      var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      var sessionId = _ref.sessionId;

      _lodash2['default'].each(registrations, function (registration) {
        if (!sessionId || sessionId !== registration.sessionId) {
          console.log("emit '" + event + "' to " + registration.user.fullName());
          registration.socket.emit(event, data);
        }
      });
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents(events, dispatcher) {
      var _this4 = this;

      _lodash2['default'].each(events, function (conf, event) {
        dispatcher.on(event, _this4.broadcast(event, conf));
      });
    }
  }]);

  return Server;
})();

function Reactor(io, events, options) {
  var register = new Register(options);
  var server = new Server(io, register);
  var dispatcher = new Dispatcher();
  server.registerEvents(events, dispatcher);
  return dispatcher;
}

module.exports = exports['default'];
//# sourceMappingURL=reactor.js.map
