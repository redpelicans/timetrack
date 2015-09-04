// version equals {package.json}.version
// githash is calculated at boot time
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function init(app, $) {
  app.get('/version', function (req, res, next) {
    res.json({
      githash: $.githash,
      version: $.version
    });
  });
}
//# sourceMappingURL=../app/version.js.map