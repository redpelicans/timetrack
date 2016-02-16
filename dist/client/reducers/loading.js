'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = loadingReducer;

var _actionsLoading = require('../actions/loading');

function loadingReducer(state, action) {
  if (state === undefined) state = 0;

  switch (action.type) {
    case _actionsLoading.START_LOADING:
      return state + 1;
    case _actionsLoading.STOP_LOADING:
      return state - 1;
    default:
      return state;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=loading.js.map
