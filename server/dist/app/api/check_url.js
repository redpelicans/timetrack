'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function init(app) {
  app.post('/check_url', function (req, res, next) {
    var url = req.body.url;
    (0, _request2['default'])({
      method: 'HEAD',
      uri: url,
      timeout: 1000
    }, function (error, response, body) {
      if (error || response.statusCode !== 200 || response.headers['content-type'].indexOf('image') !== 0) {
        // setTimeout(() => {
        // res.json({url: url, ok: false});
        // }, 3000);
        res.json({ url: url, ok: false });
      } else {
        // setTimeout(() => {
        // res.json({url: url, ok: true});
        // }, 3000);
        res.json({ url: url, ok: true });
      }
    });
  });
}
//# sourceMappingURL=check_url.js.map
