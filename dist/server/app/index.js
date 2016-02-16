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

//import {default as cookieParser} from 'cookie-parser';

var _middlewareFind_user = require('../middleware/find_user');

var _middlewareFind_user2 = _interopRequireDefault(_middlewareFind_user);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _socketIo = require('socket.io');

var _socketIo2 = _interopRequireDefault(_socketIo);

var _libReactor = require('../lib/reactor');

var _libReactor2 = _interopRequireDefault(_libReactor);

var _events = require('../events');

var _events2 = _interopRequireDefault(_events);

var logerror = (0, _debug2['default'])('timetrack:error'),
    loginfo = (0, _debug2['default'])('timetrack:info');

function start(params, resources, cb) {
  var app = (0, _express2['default'])(),
      httpServer = _http2['default'].createServer(app),
      io = (0, _socketIo2['default'])(httpServer),
      reactor = (0, _libReactor2['default'])(io, _events2['default'], { secretKey: params.secretKey });

  resources.reactor = reactor;

  function stop(cb) {
    httpServer.close(function () {
      loginfo('HTTP server stopped.');
      httpServer.unref();cb();
    });
  }

  _async2['default'].parallel({
    // init http depending on param.js
    http: function http(cb) {
      var port = params.server.port;
      var host = params.server.host || '0.0.0.0';
      httpServer.listen(port, host, function () {
        loginfo('HTTP server listening on: ' + params.server.url);
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
    //app.use(cookieParser());

    require('./ping').init(app, resources);
    require('./health').init(app, resources);
    require('./version').init(app, resources);

    app.use((0, _serveFavicon2['default'])(_path2['default'].join(__dirname, '../../../public/images/favicon.ico')));
    app.use(_express2['default']['static'](_path2['default'].join(__dirname, '../../../public')));
    app.use('/build', _express2['default']['static'](_path2['default'].join(__dirname, '../../../build')));

    // register morgan logger
    if (params.verbose) app.use((0, _morgan2['default'])('dev'));

    require('./login').init(app, resources, params);
    require('./logout').init(app, resources, params);

    // require auth

    app.get('/user', (0, _middlewareFind_user2['default'])(params.secretKey), function (req, res, next) {
      res.json(req.user);
    });

    app.use('/api', (0, _middlewareFind_user2['default'])(params.secretKey), require('./api').init(app, resources, params));

    // app.use(function(req, res, next){
    //   res.sendFile(path.join(__dirname + '../../../../public/index.html'))
    // });

    app.set('views', _path2['default'].join(__dirname, '../../../views'));
    app.set('view engine', 'ejs');
    require('./universal').init(app, resources);

    app.use(_middlewareErrors2['default']);

    cb(null, { stop: stop });
  });
}
//# sourceMappingURL=index.js.map
