'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = checkRights;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _rights = require('../rights');

var _rights2 = _interopRequireDefault(_rights);

function checkRights(event) {
  var requestedRoles = _rights2['default'][event] && _rights2['default'][event].roles || [];
  return function (req, res, next) {
    var user = req.user;
    if (!user) {
      return res.sendStatus(401).json({ message: "Unknown User" });
    }
    if (!user.hasAllRoles(requestedRoles)) return res.sendStatus(403).json({ message: "Unauthorized User" });
    next();
  };
}

module.exports = exports['default'];
//# sourceMappingURL=check_rights.js.map
