'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.connect = connect;
exports.login = login;
exports.logout = logout;
var CONNECT = 'SOCKETIO_CONNECT';
exports.CONNECT = CONNECT;
var SOCKETIO_LOGIN = 'SOCKETIO_LOGIN';
exports.SOCKETIO_LOGIN = SOCKETIO_LOGIN;
var SOCKETIO_LOGOUT = 'SOCKETIO_LOGOUT';

exports.SOCKETIO_LOGOUT = SOCKETIO_LOGOUT;

function connect(socket) {
  return {
    type: CONNECT,
    socket: socket
  };
}

function login() {
  return function (dispatch, getState) {
    var state = getState();
    if (state.socketIO.socket) {
      var _state$login = state.login;
      var appJwt = _state$login.appJwt;
      var sessionId = _state$login.sessionId;

      state.socketIO.socket.emit('login', { token: appJwt, sessionId: sessionId }, function (data) {
        if (data.status !== 'ok') {
          dispatch(alert({ header: 'Error', message: "Cannot subscribe to pushed events" }));
        } else {
          dispatch({ type: SOCKETIO_LOGIN });
        }
      });
    }
  };
}

function logout() {
  return function (dispatch, getState) {
    var state = getState();
    if (state.socketIO.socket) {
      state.socketIO.socket.emit('logout');
      dispatch({ type: SOCKETIO_LOGOUT });
    }
  };
}

var socketIOActions = { connect: connect, login: login, logout: logout };
exports.socketIOActions = socketIOActions;
//# sourceMappingURL=socketIO.js.map
