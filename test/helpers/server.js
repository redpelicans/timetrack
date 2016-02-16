import  _  from 'lodash'
import  moment from "moment"
import  async from "async"
import njwt from 'njwt'
import * as server from '../../server/src/index'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import {ObjectId} from 'mongobless'

const database = 'test'
const db = process.env['NODE_ENV'] === 'travis' ? {host: 'localhost', port: 27017, database} : _.extend({}, require('../../params').db, {database})
const params = {
  server: {
     host: 'localhost'
   , port: 7777
   , get url(){ return 'http://' + this.host + ':' + this.port } 
  },
  db,
  secretKey: 'test',
  verbose: false,
  duration: moment().add(1, 'day').toDate(),
  user: {
    _id: ObjectId(),
    email: "test@redpelicans.com",
    roles : ["admin"],
    firstName: "test",
    lastName: "test",
    type: "worker",
  }
}

require('universal-fetch')
global.window = { location: { origin: params.server.url } }

export function createServer(cb){
  async.waterfall([startServer.bind(null, {params}), loadUser, createDBLoader], cb)
}

function stop(server, cb){
  server.stop(cb)
}

function startServer({params}, cb){
  server.create(params)
    .then( value => {
      const server = {
        stop: stop.bind(null, value.server), 
      }
      cb(null, {server, params, resources: value.resources}) 
    })
    .catch( err => cb(err) )
}

function loadUser(data, cb){
  dropAndLoadUser(data.resources.db, data.params, err => cb(err, data));
}

function createDBLoader(data, cb){
  const db = { 
    drop: dropAndLoadUser.bind(null, data.resources.db, data.params),
    load: load.bind(null, data.resources.db),
  };
  setImmediate(cb, null, {...data, db})
}

export function configureStore(reducer, initialState, types){
  const sessionId = 1
  const appJwt = getToken(params.user._id, params.secretKey, params.duration)
  const loginState = {login: {appJwt, sessionId}}
  const state = {...initialState, ...loginState}
  return createStore( reducer, state, applyMiddleware(myMiddleware(types), thunk))
}

const isFunction = arg => typeof arg === 'function'

const myMiddleware = (types={}) => {
  const fired = {}
  return store => next => action => {
    const result = next(action)
    const cb = types[action.type]
    if(cb && !fired[action.type]){
      if(!isFunction(cb)) throw new Error("action's type value must be a function")
      fired[action.type] = true
      cb(store.getState, action)
    }
    return result
  }
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    return err
  }
}

function getToken(id, secretKey, expirationDate){
  const claims = {
    sub: id.toString(),
    iss: 'http://timetrack.repelicans.com',
  }
  const jwt = njwt.create(claims,secretKey)
  jwt.setExpiration(expirationDate)
  return jwt.compact()
}

function load(db, data, cb){
  var names = Object.keys(data.collections);
  async.each(names, function(name, cb) {
    db.collection(name).insert(data.collections[name], cb)
  }, cb)
}

function dropAndLoadUser(db, params, cb){
  db.collections(function(err, collections) {
    async.each(collections, function(collection, cb) {
      if (collection.collectionName.indexOf('system') === 0) {
        return cb();
      }
      collection.remove(cb);
    }, (err) => {
      db.collection('people').insertOne( params.user, cb)
    });
  });
}


