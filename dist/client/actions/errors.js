'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.alert = alert;
var ALERT = 'ALERT';

exports.ALERT = ALERT;

function alert(error) {
  return {
    type: ALERT,
    header: error.header,
    message: error.message
  };
}
//# sourceMappingURL=errors.js.map
