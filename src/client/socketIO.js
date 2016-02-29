import socketIO from 'socket.io-client';
import {personsActions} from './actions/persons';
import {companiesActions} from './actions/companies';
import {missionsActions} from './actions/missions';
import {notesActions} from './actions/notes';
import {socketIOActions} from './actions/socketIO';
import {alert} from './actions/errors';

let socket;
let commError = false;

export function registerSocketIO(store){
  function ping(delay){
    let ack = false;
    const state = store.getState();
    const token = state.login && state.login.appJwt;
    const sessionId = state.login && state.login.sessionId;
    const message = { type: 'ping', token, sessionId };

    socket.send(message, (res) => {
      ack = true;
      commError = false;
    });

    setTimeout( () => {
      if(ack)return ping(5000);
      if(commError) return ping(2000);
      commError = true;
      store.dispatch(alert({ header: 'Server Communication Error', message: 'Cannot ping server' }));
    }, delay);
  }

  socket = socketIO.connect();
  window.wst = socket;
  socket.on('connect', () => {
    console.log("socket.IO connected ..."); 
    ping(5000);
    store.dispatch(socketIOActions.connect(socket));

    registerAction('person.new', personsActions.createCompleted);
    registerAction('person.delete', personsActions.deleteCompleted);
    register('person.update', updatePerson);

    registerAction('company.new', companiesActions.createCompleted);
    registerAction('company.delete', companiesActions.deleteCompleted);
    register('company.update', updateCompany);

    registerAction('mission.new', missionsActions.createCompleted);
    registerAction('mission.delete', missionsActions.deleteCompleted);
    register('mission.update', updateMission);

    registerAction('note.new', notesActions.createCompleted);
    registerAction('note.delete', notesActions.deleteCompleted);
    register('note.update', updateNote);
  });

  function registerAction(name, action){
    socket.on(name, data => store.dispatch(action(data)) );
  }

  function register(name, fct){
    socket.on(name, fct);
  }

  function updatePerson(data){
    store.dispatch(personsActions.updateCompleted(data.previous, data.current));
  }

  function updateCompany(data){
    //store.dispatch(companiesActions.updateCompleted(data.previous, data.current));
    store.dispatch(companiesActions.updateCompleted(data.current));
  }

  function updateNote(data){
    store.dispatch(notesActions.updateCompleted(data.previous, data.current));
  }

  function updateMission(data){
    store.dispatch(missionsActions.updateCompleted(data.previous, data.current));
  }

}
