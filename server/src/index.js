import async from 'async'; import debug from 'debug';
import * as app  from './app';
import githash from './init/githash';

let logerror = debug('transac:error')
  , loginfo = debug('transac:info');

let resources = {};
    
const version = require('../../package.json').version;

export function create(params){
  let promise = new Promise( (resolve, reject) => {
    async.parallel({
      //conn: rdb.init(params.rethinkdb),
      githash: githash.init()
    }, (err, init) => {
      if(err) reject(err);
      resources.conn = init.conn;
      resources.version = version;
      resources.githash = init.githash;
      app.start(params, resources, (err, server) => {
        if(err) reject(err);
        resolve(server);
      });
    });
  });
  return promise;
}
