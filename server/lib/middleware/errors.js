'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = errors;

var _helpers = require('../helpers');

// to be called at the end of the middleware chain
// to raise errors

function errors(err, req, res, next) {
  if (!err) return next();
  if (err instanceof _helpers.NotFoundError) {
    res.sendStatus(404);
  } else if (err instanceof _helpers.TransacError) {
    var message = err.message || err.toString();
    res.status(418).json({ message: message, code: err.code });
  } else {
    var message = err.message || err.toString();
    console.log(err.stack);
    res.status(500).json({ message: message });
  }
}

module.exports = exports['default'];
//# sourceMappingURL=../middleware/errors.js.map