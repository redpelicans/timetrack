'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.start = start;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _middlewareErrors = require('../middleware/errors');

var _middlewareErrors2 = _interopRequireDefault(_middlewareErrors);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var logerror = (0, _debug2['default'])('timetrack:error'),
    loginfo = (0, _debug2['default'])('timetrack:info');

function start(params, resources, cb) {
  var app = (0, _express2['default'])(),
      httpServer = _http2['default'].createServer(app);

  function stop(cb) {
    httpServer.close(function () {
      httpServer.unref();cb();
    });
  }

  _async2['default'].parallel({
    // init http depending on param.js
    http: function http(cb) {
      var port = params.server.port;
      httpServer.listen(port, function () {
        loginfo('HTTP server listening on port: ' + port);
        cb();
      });
    }
  }, function (err) {
    if (err) return cb(err);

    // register middleware, order matters

    // remove for security reason
    app.disable('x-powered-by');
    // usually node is behind a proxy, will keep original IP
    app.enable('trust proxy');

    // register bodyParser to automatically parse json in req.body and parse url
    // params
    app.use(_bodyParser2['default'].urlencoded({ limit: '10mb', extended: true }));
    app.use(_bodyParser2['default'].json({ limit: '10mb', extended: true }));

    // manage cookie
    app.use((0, _cookieParser2['default'])());

    //app.use(express.static(path.join(__dirname, '../../../public')));

    require('./ping').init(app, resources);
    require('./version').init(app, resources);

    // register morgan logger
    app.use((0, _morgan2['default'])('dev'));

    app.use('/api', require('./api').init(app, resources));

    app.use(_middlewareErrors2['default']);

    cb(null, { stop: stop });
  });
}
//# sourceMappingURL=../app/index.js.map