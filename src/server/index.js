import async from 'async'; import debug from 'debug';
import * as app  from './app';
import initGithash from './init/githash';
import initModels from './init/models';

let logerror = debug('transac:error')
  , loginfo = debug('transac:info');

let resources = {};
    
const version = require('../../package.json').version;

export function create(params){
  let promise = new Promise( (resolve, reject) => {
    async.parallel({
      db: initModels(params.db),
      githash: initGithash()
    }, (err, init) => {
      if(err) reject(err);
      resources.db = init.db;
      resources.version = version;
      resources.githash = init.githash;
      app.start(params, resources, (err, server) => {
        if(err) reject(err);
        resolve({server, resources});
      });
    });
  });
  return promise;
}
