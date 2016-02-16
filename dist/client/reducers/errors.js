'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = errorReducer;

var _actionsErrors = require('../actions/errors');

function errorReducer(state, action) {
  if (state === undefined) state = {};

  switch (action.type) {
    case _actionsErrors.ALERT:
      return {
        header: action.header,
        message: action.message
      };
    default:
      return state;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=errors.js.map
