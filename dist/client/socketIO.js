'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.registerSocketIO = registerSocketIO;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

var _actionsPersons = require('./actions/persons');

var _actionsCompanies = require('./actions/companies');

var _actionsMissions = require('./actions/missions');

var _actionsNotes = require('./actions/notes');

var _actionsSocketIO = require('./actions/socketIO');

var _actionsErrors = require('./actions/errors');

var socket = undefined;
var commError = false;

function registerSocketIO(store) {
  function ping(delay) {
    var ack = false;
    var state = store.getState();
    var token = state.login && state.login.appJwt;
    var sessionId = state.login && state.login.sessionId;
    var data = { message: 'ping', token: token, sessionId: sessionId };

    socket.emit('ping', data, function () {
      ack = true;
      commError = false;
    });

    setTimeout(function () {
      if (ack) return ping(1000);
      if (commError) return ping(1000);
      commError = true;
      store.dispatch((0, _actionsErrors.alert)({ header: 'Server Communication Error', message: 'Cannot ping server' }));
    }, delay);
  }

  socket = _socketIoClient2['default'].connect();
  socket.on('connect', function () {

    ping(5000);
    store.dispatch(_actionsSocketIO.socketIOActions.connect(socket));

    registerAction('person.new', _actionsPersons.personsActions.createCompleted);
    registerAction('person.delete', _actionsPersons.personsActions.deleteCompleted);
    register('person.update', updatePerson);

    registerAction('company.new', _actionsCompanies.companiesActions.createCompleted);
    registerAction('company.delete', _actionsCompanies.companiesActions.deleteCompleted);
    register('company.update', updateCompany);

    registerAction('mission.new', _actionsMissions.missionsActions.createCompleted);
    registerAction('mission.delete', _actionsMissions.missionsActions.deleteCompleted);
    register('mission.update', updateMission);

    registerAction('note.new', _actionsNotes.notesActions.createCompleted);
    registerAction('note.delete', _actionsNotes.notesActions.deleteCompleted);
    register('note.update', updateNote);
  });

  function registerAction(name, action) {
    socket.on(name, function (data) {
      return store.dispatch(action(data));
    });
  }

  function register(name, fct) {
    socket.on(name, fct);
  }

  function updatePerson(data) {
    store.dispatch(_actionsPersons.personsActions.updateCompleted(data.previous, data.current));
  }

  function updateCompany(data) {
    //store.dispatch(companiesActions.updateCompleted(data.previous, data.current));
    store.dispatch(_actionsCompanies.companiesActions.updateCompleted(data.current));
  }

  function updateNote(data) {
    store.dispatch(_actionsNotes.notesActions.updateCompleted(data.previous, data.current));
  }

  function updateMission(data) {
    store.dispatch(_actionsMissions.missionsActions.updateCompleted(data.previous, data.current));
  }
}
//# sourceMappingURL=socketIO.js.map
