'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _actionsSocketIO = require('../actions/socketIO');

function socketIOReducer(state, action) {
  if (state === undefined) state = {};

  switch (action.type) {
    case _actionsSocketIO.CONNECT:
      return { socket: action.socket };
    case _actionsSocketIO.SOCKETIO_LOGIN:
    case _actionsSocketIO.SOCKETIO_LOGOUT:
    default:
      return state;
  }
}

exports['default'] = socketIOReducer;
module.exports = exports['default'];
//# sourceMappingURL=socketIO.js.map
