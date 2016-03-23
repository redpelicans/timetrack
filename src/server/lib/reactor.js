import {EventEmitter} from 'events';
import {Person} from '../models';
import rights from '../rights';
import debug from 'debug';
import _ from 'lodash';
import async from 'async';
import {default as cookieParser}  from 'socket.io-cookie';

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

  add(user, socket, token, sessionId){
    this.connections[socket.id] = {token, sessionId, socket, user, createdAt: new Date()};
  }

  remove(socket){
    const subscription = this.get(socket);
    if(!subscription) return logerror("Cannot find socketio subscription");
    if(!subscription.user) return;
    loginfo(`User ${subscription.user.fullName()} disconnected from socket.io.`);
    delete this.connections[socket.id];
  }

  getAllUsers(){
    return _.map(this.connections, con => _.pick(con, 'user', 'sessionId', 'createdAt'));
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
        cb(null, _.chain(registrations).compact().filter(r => r.user.hasAllRoles(rights[right])).value());
      }
    );
  }
}

class Dispatcher extends EventEmitter{
  constructor(registrations){
    super();
    this.registrations = registrations;
  }
}

class Server{
  constructor(io, register, {secretKey}){
    this.io = io;
    this.secretKey = secretKey;
    this.subscriptions = register;
    this.init();
  }

  init(){
    this.io.use(cookieParser);
    this.io.use((socket, next) => {
      //const token = socket.handshake.query.tokenAccess;
      const cookie = socket.request.headers.cookie.timetrackToken;
      //console.log(cookie)
      if(!cookie){
        logerror("Try to connect to socketio without token !!!");
        return next(new Error("Socket.io: Unauthorized access"));
      }
      Person.getFromToken(cookie, this.secretKey, (err, user) => {
        if(err){
          logerror(err);
          return next(new Error("Socket.io: Unauthorized access"));
        }
        if(!user){
          logerror("Try to connect to socketio with an unknown user!");
          return next(new Error("Unknown user"));
        }
        if(!user.hasSomeRoles(['admin', 'access'])){
          logerror("Try to connect to socketio with wrong roles!");
          return next(new Error("Socket.io: Unauthorized access"));
        }
        loginfo(`User '${user.fullName()}' logged via socketIO`);

        const sessionId = socket.handshake.query.sessionId;
        this.subscriptions.add(user, socket, cookie, sessionId);
        socket.request.user = user;
        next();
      });
    });

    this.io.on('connection', socket => {
      socket.on('error', (msg) => {
        logerror(msg);
      });

      //loginfo("Socket.IO connection");
      socket.emit('loggedIn', { user: JSON.stringify(socket.request.user) });

      socket.on('message', (msg, cb) => {
        switch(msg.type){
          case 'ping':
            return this.ping(socket, msg, cb);
          case 'login':
            return this.login(socket, msg, cb);
          case 'logout':
            return this.logout(socket);
          default:
            logerror("Unknown socket.io message's type");
        }
      })
      socket.on('disconnect', () => this.subscriptions.remove(socket) );
    });
  }

  logout(socket){
    loginfo(`User ${socket.request.user.fullName()} logout from socket.io.`);
    this.subscriptions.remove(socket);
  }

  broadcast(event, conf){
    const server = this;
    return function(data, params){
      server.subscriptions.getAuthorizedRegistrations(conf.right, (err, registrations) => {
        if(err) logerror(err);
        if(!conf.callback) return server.emit(event, data, registrations, params);
        conf.callback(event, registrations, server.emit.bind(server), data, params);
      });
    }
  }

  emit(event, data, registrations, {sessionId} = {}){
    _.each(registrations, registration => {
      if(!sessionId || sessionId !== registration.sessionId){
        loginfo("emit '" + event + "' to " + registration.user.fullName());
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
  const server = new Server(io, register, options);
  const dispatcher = new Dispatcher(register);
  server.registerEvents(events, dispatcher);
  return dispatcher;
}


