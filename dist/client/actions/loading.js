'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.startLoading = startLoading;
exports.stopLoading = stopLoading;
var START_LOADING = 'START_LOADING';
exports.START_LOADING = START_LOADING;
var STOP_LOADING = 'STOP_LOADING';

exports.STOP_LOADING = STOP_LOADING;

function startLoading() {
  return {
    type: START_LOADING
  };
}

function stopLoading() {
  return {
    type: STOP_LOADING
  };
}
//# sourceMappingURL=loading.js.map
