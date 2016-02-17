'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = checkUser;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function checkUser(roles) {
  if (typeof roles == 'string') roles = [roles];
  var requestedRoles = roles;
  return function (req, res, next) {
    var user = req.user;
    if (!user) {
      return res.sendStatus(401).json({ message: "Unknown User" });
    }
    //if (!hasAllRoles(user, requestedRoles)) return res.sendStatus(403).json({message: "Unauthorized User"});
    if (!user.hasAllRoles(requestedRoles)) return res.sendStatus(403).json({ message: "Unauthorized User" });
    next();
  };
}

// function hasAllRoles(user, roles){
//   return _.chain(roles).difference(user.roles || []).isEmpty().value();
// }
module.exports = exports['default'];
//# sourceMappingURL=check_user.js.map
