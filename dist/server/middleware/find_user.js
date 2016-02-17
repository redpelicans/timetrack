'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = findUser;

var _models = require('../models');

function findUser(secretKey) {
  return function (req, res, next) {
    var cookie = req.headers['x-token-access'];
    if (!cookie) return res.status(401).json({ message: "Unauthorized access" });
    var sessionId = req.headers['x-sessionid'];
    req.sessionId = sessionId;
    _models.Person.getFromToken(cookie, secretKey, function (err, user) {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized access" });
      }
      if (!user) return res.status(401).json({ message: "Unknown user" });
      if (!user.hasSomeRoles(['admin', 'access'])) return res.status(401).json({ message: "Unauthorized access" });
      req.user = user;
      //console.log(`==> user: ${user.email}`);
      next();
    });
  };
}

module.exports = exports['default'];
//# sourceMappingURL=find_user.js.map
