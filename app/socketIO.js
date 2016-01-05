import socketIO from 'socket.io-client';
import errors from './models/errors';
import {personsActions} from './models/persons';
import {companiesActions} from './models/companies';
import {loginStore} from './models/login';
import _ from 'lodash';

var socket
  , commError = false;

function ping(delay){
  let ack = false;
  let data = {
    message: 'ping',
    token: loginStore.getJwt(),
    sessionId: loginStore.getSessionId(),
  };

  socket.emit('ping', data, () => {
    ack = true;
    commError = false;
  });
  setTimeout( () => {
    if(ack)return ping(1000);
    if(commError) return ping(1000);
    commError = true;
    errors.alert({ header: 'Server Communication Error', message: 'Cannot ping server' });
  }, delay);
}

export function registerSocketIO(){
  socket = socketIO.connect();
  socket.on('connect', () => {
    ping(5000);
    login();

    register('person.new', personsActions.createCompleted);
    register('person.delete', personsActions.deleteCompleted);
    register('person.update', updatePerson);

    register('company.new', companiesActions.createCompleted);
    register('company.delete', companiesActions.deleteCompleted);
    register('company.update', updateCompany);
  });
}

function register(name, fct){
  socket.on(name, fct);
}

function login(){
  loginStore.setSocketIO(socket);
}

function updatePerson(data){
  personsActions.updateCompleted(data.previous, data.current);
}

function updateCompany(data){
  companiesActions.updateCompleted(data.previous, data.current);
}
