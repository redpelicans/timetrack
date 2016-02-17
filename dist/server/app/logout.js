'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _njwt = require('njwt');

var _njwt2 = _interopRequireDefault(_njwt);

function init(app, resources, params) {
  app.get('/logout', function (req, res, next) {
    res.clearCookie('access_token');
    res.json({ logout: true });
  });
}
//# sourceMappingURL=logout.js.map
