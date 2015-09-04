// useful for monitoring
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function init(app) {
  app.get('/ping', function (req, res) {
    res.json({ data: 'pong' });
  });
}
//# sourceMappingURL=../app/ping.js.map