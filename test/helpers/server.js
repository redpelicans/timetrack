import  _  from 'lodash'
import  moment from "moment"
import  async from "async"
import njwt from 'njwt'
import * as server from '../../server/src/index'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../../app/reducers'
import {ObjectId} from 'mongobless'
import {Person} from '../../server/dist/models'

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

export function start(cb){
  async.waterfall([startServer.bind(null, params), loadUser, createLocalStore], cb)
}

function stop(server, cb){
  server.stop(cb)
}

function startServer(params, cb){
  server.create(params)
    .then( value => {
      cb(null, {stop: stop.bind(null, value.server)}, params, value.resources) 
    })
    .catch( err => cb(err) )
}

function loadUser(server, params, resources, cb){
  Person.collection.insertOne( params.user, err => cb(err, server, params, resources) )
}

function createLocalStore(server, params, resources, cb){
  const sessionId = 1
  const appJwt = getToken(params.user._id, params.secretKey, params.duration)
  const store = createStore( rootReducer, {login: {appJwt, sessionId}}, compose(applyMiddleware(thunk)))
  setImmediate(cb, null, server, store)
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

