import PouchDB from 'pouchdb';
import errors from '../models/errors';


const localDB = new PouchDB('timetrack');
const remoteDB = new PouchDB('http://rp1.redpelicans.com:5984/timetrack', { auth:{ username: 'admin', password: 'pasdire' }});

const sync = PouchDB.sync(localDB, remoteDB, {live: true, retry: true})
  .on('error', err => errors.alert({
      header: 'PouchDB Sync',
      message: err.toString()
    }))
  .on('active', () => console.log("PouchDB replication is activated"))
  .on('denied', info => console.log("PouchDB replication denied"))
  .on('paused', info => console.log("PouchDB replication paused"))
  // .on('change', info => {
  //   console.log(`PouchDB replication info`);
  //   console.log(info);
  // })
  .on('complete', info => console.log(info));

export {localDB as db, sync};


