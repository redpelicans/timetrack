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

let logerror = debug('timetrack:error')
  , loginfo = debug('timetrack:info');

export function start(params, resources, cb) {
  let app = express()
    , httpServer = http.createServer(app);


  function stop(cb){
    httpServer.close(()=>{httpServer.unref(); cb()});
  }

  async.parallel({
    // init http depending on param.js
    http: function(cb){
      let port = params.server.port;
      httpServer.listen(port, function() {
        loginfo(`HTTP server listening on port: ${port}`);
        cb();
      });
    }
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

    //app.use(express.static(path.join(__dirname, '../../../public')));

    require('./ping').init(app, resources);
    require('./version').init(app, resources);

    // register morgan logger
    app.use(logger('dev'));

    require('./login').init(app, resources, params);
    require('./logout').init(app, resources, params);

    // require auth 
    app.use(findUser(params.secretKey));

    require('./user').init(app, resources, params);
    app.use('/api', require('./api').init(app, resources, params));
    
    app.use(errors);

    cb(null, {stop: stop});
  });
}

