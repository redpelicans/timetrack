'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

var _models = require('../../models');

function init(app) {
  app.get('/missions', function (req, res, next) {
    _models.Mission.findAll(function (err, missions) {
      if (err) return next(err);
      res.json(missions);
    });
  });
}
//# sourceMappingURL=missions.js.map
