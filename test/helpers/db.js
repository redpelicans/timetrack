import  _  from 'lodash';
import  async  from 'async';
import mongobless from 'mongobless';

let DB;

export function connect(database = 'tests', cb){
  let opt = process.env['NODE_ENV'] === 'travis' ? {host: 'localhost', port: 27017, database: database} : _.extend({}, require('../../src/server/params').db, {database: database});
  mongobless.connect(opt, function(err, db) {
    if(err) return cb(err);
    //console.log('Mintello models are ready to help you ...');
    DB = db;
    cb(err, mongobless);
  });
}

export function close(cb){
  mongobless.close(cb);
}

export function drop(cb){
  DB.collections(function(err, collections) {
    async.each(collections, function(collection, cb) {
      if (collection.collectionName.indexOf('system') === 0) {
        return cb();
      }
      collection.remove(cb);
    }, cb);
  });
}


export function load(data, cb){
  var names = Object.keys(data.collections);
  async.each(names, function(name, cb) {
    DB.collection(name).insert(data.collections[name], cb)
  }, cb)
}
