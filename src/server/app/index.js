import errors from '../middleware/errors';
import debug from 'debug';
import path from 'path';
import http from 'http';
import async from 'async';
import {default as logger} from 'morgan';
import {default as bodyParser} from 'body-parser';
import {default as cookieParser} from 'cookie-parser';
import findUser from '../middleware/find_user';
import express from 'express';
import expressLess from 'express-less';
import favicon from 'serve-favicon';
import socketIO from 'socket.io';
import Reactor from '../lib/reactor';
import events from '../events';
import {init as initServerSideRendering} from './universal';
import {init as initPing} from './ping';
import {init as initHealth} from './health';
import {init as initVersion} from './version';
import {init as initLogin} from './login';
import {init as initLogout} from './logout';
import {init as initAPI} from './api';

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
    app.use('/styles', expressLess(path.join(__dirname, '../../../public/styles'), {compress: true, debug: true}));

    app.use(cookieParser());

    initPing(app, resources);
    initHealth(app, resources);
    initVersion(app, resources);

    app.use(favicon(path.join(__dirname, '../../../public/images/favicon.ico')));
    app.use(express.static(path.join(__dirname, '../../../public')));
    app.use('/build', express.static(path.join(__dirname, '../../../build')));

    // register morgan logger
    if(params.verbose) app.use(logger('dev'));

    initLogin(app, resources, params);
    initLogout(app, resources, params);

    // require auth 

    app.get('/user', findUser(params.secretKey), function(req, res, next){
      res.json(req.user);
    });

    app.use('/api', findUser(params.secretKey), initAPI(app, resources, params));

    // app.use(function(req, res, next){ 
    //   res.sendFile(path.join(__dirname + '../../../../public/index.html')) 
    // }); 
    
    app.set('views', path.join(__dirname, '../../../views'));
    app.set('view engine', 'ejs');
    initServerSideRendering(app, resources, params);

    app.use(errors);

    cb(null, {stop: stop});
  });
}

