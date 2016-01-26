import {EventEmitter} from 'events';
import {Person} from '../models';
import rights from '../rights';
import debug from 'debug';
import _ from 'lodash';
import async from 'async';

const logerror = debug('timetrack:error')
  , loginfo = debug('timetrack:info');

class Register {
  constructor(options){
    this.connections = {};
    this.options = options;
  }

  get(socket){
    return this.connections[socket.id];
  }

  add(socket, token, sessionId, cb){
    if(!token)return setImmediate(cb, 'Wrong token');
    Person.getFromToken(token, this.options.secretKey, (err, user) => {
      if(err)cb(err);
      this.connections[socket.id] = {token, sessionId, socket, user};
      cb(null, this.connections[socket.id]);
    });
  }

  remove(socket){
    const subscription = this.get(socket);
    if(!subscription)return console.error("Cannot find subscription");
    if(!subscription.user)return;
    loginfo(`User ${subscription.user.fullName()} disconnected from socket.io.`);
    delete this.connections[socket.id];
  }

  getAuthorizedRegistrations(right, cb){
    async.map(
      _.values(this.connections), 
      (registration, cb) => {
        Person.getFromToken(registration.token, this.options.secretKey, (err, user) => {
          if(err)cb(null, null);
          registration.user = user;
          cb(null, registration);
        });
      },
      (err, registrations) => {
        if(err) return cb(err);
        cb(null, _.chain(registrations).compact().filter(r => r.user && r.user.hasAllRoles(rights[right])).value());
      }
    );
  }
}

class Dispatcher extends EventEmitter{
  constructor(){
    super();
  }
}

function ping(socket, data, cb){
  cb('pong') 
}

function login(socket, data, cb){
  this.subscriptions.add(socket, data.token, data.sessionId, (err, subscription) => {
    if(err) return cb({status: 'error', error: err});
    loginfo(`User ${subscription.user.fullName()} connected from socket.io.`);
    cb({status: 'ok'});
  });
}

function logout(socket){
  this.subscriptions.remove(socket);
}

class Server{
  constructor(io, register){
    this.io = io;
    this.subscriptions = register;
    this.init();
  }

  init(){
    this.io.on('connection', socket => {
      loginfo("Socket.IO connection");
      socket.on('disconnect', () => this.subscriptions.remove(socket) );
      this.registerCallback('ping', ping, socket);
      this.registerCallback('login', login, socket);
      this.registerCallback('logout', logout, socket);
    });
  }

  registerCallback(name, fct, socket){
    socket.on(name, fct.bind(this, socket));
  }


  broadcast(event, conf){
    const server = this;
    return function(data, params){
      server.subscriptions.getAuthorizedRegistrations(conf.right, (err, registrations) => {
        if(err) console.error(err);
        if(!conf.callback) return server.emit(event, data, registrations, params);
        conf.callback(event, registrations, server.emit.bind(server), data, params);
      });
    }
  }

  emit(event, data, registrations, {sessionId} = {}){
    _.each(registrations, registration => {
      if(!sessionId || sessionId !== registration.sessionId){
        console.log("emit '" + event + "' to " + registration.user.fullName());
        registration.socket.emit(event, data)
      }
    });
  }

  registerEvents(events, dispatcher){
    _.each(events, (conf, event) => {
      dispatcher.on(event, this.broadcast(event, conf));
    })
  }
}

export default function Reactor(io, events, options){
  const register = new Register(options);
  const server = new Server(io, register);
  const dispatcher = new Dispatcher();
  server.registerEvents(events, dispatcher);
  return dispatcher;
}


