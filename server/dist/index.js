'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.create = create;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _app = require('./app');

var app = _interopRequireWildcard(_app);

var _initGithash = require('./init/githash');

var _initGithash2 = _interopRequireDefault(_initGithash);

var _initModels = require('./init/models');

var _initModels2 = _interopRequireDefault(_initModels);

var logerror = (0, _debug2['default'])('transac:error'),
    loginfo = (0, _debug2['default'])('transac:info');

var resources = {};

var version = require('../../package.json').version;

function create(params) {
  var promise = new Promise(function (resolve, reject) {
    _async2['default'].parallel({
      db: (0, _initModels2['default'])(params.db),
      githash: (0, _initGithash2['default'])()
    }, function (err, init) {
      if (err) reject(err);
      resources.db = init.db;
      resources.version = version;
      resources.githash = init.githash;
      app.start(params, resources, function (err, server) {
        if (err) reject(err);
        resolve(server);
      });
    });
  });
  return promise;
}
//# sourceMappingURL=index.js.map
