// run as: "babel-node --stage 0 loadClients.js"

import PouchDB  from 'pouchdb';
import async from 'async';
import _ from 'lodash';
import faker from 'faker';
//import params from '../params';

faker.locale = 'en';

require('better-log').install();

const db = new PouchDB('http://rp1.redpelicans.com:5984/timetrack', {
  auth:{
    username: 'admin',
    password: 'pasdire'
  }})

async.waterfall([loadAll ], (err, docs) => {
  if(err)console.log(err);
  _.each(docs.rows, r => console.log(r.doc))
});

function loadAll(cb){
  db.allDocs({include_docs: true}, cb);
}
