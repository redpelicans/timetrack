import errors from '../middleware/errors';
import debug from 'debug';
import path from 'path';
import http from 'http';
import async from 'async';
import {default as logger} from 'morgan';
import {default as bodyParser} from 'body-parser';
//import {default as cookieParser} from 'cookie-parser';
import findUser from '../middleware/find_user';
import express from 'express';
import favicon from 'serve-favicon';
import socketIO from 'socket.io';
import Reactor from '../lib/reactor';
import events from '../events';

let logerror = debug('timetrack:error')
  , loginfo = debug('timetrack:info');

export function start(params, resources, cb) {
  let app = express()
    , httpServer = http.createServer(app)
    , io = socketIO(httpServer)
    , reactor = Reactor(io, events, {secretKey: params.secretKey});

  resources.reactor = reactor;

  function stop(cb){
    httpServer.close(()=>{
      loginfo(`HTTP server stopped.`);
      httpServer.unref(); cb()
    });
  }

  async.parallel({
    // init http depending on param.js
    http(cb){
      let port = params.server.port;
      let host = params.server.host || '0.0.0.0';
      httpServer.listen(port, host, function() {
        loginfo(`HTTP server listening on: ${params.server.url}`);
        cb();
      });
    },
  }, function(err){
    if(err)return cb(err);

    // register middleware, order matters

    // remove for security reason
    app.disable('x-powered-by');
    // usually node is behind a proxy, will keep original IP
    app.enable('trust proxy');

    // register bodyParser to automatically parse json in req.body and parse url
    // params
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.use(bodyParser.json({limit: '10mb', extended: true}));

    // manage cookie
    //app.use(cookieParser());

    app.use(favicon(__dirname + '../../../../public/images/favicon.ico'));
    app.use(express.static(path.join(__dirname, '../../../../public')));
    app.use('/build', express.static(path.join(__dirname, '../../../build')));

    require('./ping').init(app, resources);
    require('./health').init(app, resources);
    require('./version').init(app, resources);

    // register morgan logger
    if(params.verbose) app.use(logger('dev'));

    require('./login').init(app, resources, params);
    require('./logout').init(app, resources, params);

    // require auth 

    app.get('/user', findUser(params.secretKey), function(req, res, next){
      res.json(req.user);
    });

    app.use('/api', findUser(params.secretKey), require('./api').init(app, resources, params));

    app.use(function(req, res, next){ 
      res.sendFile(path.join(__dirname + '../../../../public/index.html')) 
    }); 

    app.use(errors);

    cb(null, {stop: stop});
  });
}

