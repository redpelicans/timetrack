import  _  from 'lodash';
import  async  from 'async';
import * as server from '../../server/dist/index';

let SERVER;
const database = 'test';
const db = process.env['NODE_ENV'] === 'travis' ? {host: 'localhost', port: 27017, database} : _.extend({}, require('../../params').db, {database});
const params = {
  server: {
     host: 'localhost'
   , port: 7777
   , get url(){ return 'http://' + this.host + ':' + this.port } 
  },
  db,
  secretKey: 'test',
};

export function start(cb){
  server.create(params)
    .then( (server) => {
      SERVER = server
      cb() 
    })
    .catch( err => cb(err) )
}

export function stop(cb){
  SERVER && SERVER.stop(cb);
}

