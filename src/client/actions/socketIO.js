export const CONNECTED = 'SOCKETIO_CONNECTED';
export const DISCONNECTED = 'SOCKETIO_DISCONNECTED';

import socketIO from 'socket.io-client';
import {personsActions} from './persons';
import {companiesActions} from './companies';
import {missionsActions} from './missions';
import {notesActions} from './notes';
import {alert} from './errors';


export function connected(socket){
  return {
    type: CONNECTED,
    socket
  }
}

export function connect(token, sessionId){
  return (dispatch) => {
    const socket = socketIO.connect({query: `tokenAccess=${token}&sessionId=${sessionId}`});
    let commError = false;

    socket.on('disconnect', () => {
      console.log("socket.IO disconnected ..."); 
      //if(!commError) dispatch(alert({ header: 'Server Communication Error', message: 'Cannot ping server' }));
      commError = true;
    });

    socket.on('error', (err) => {
      console.log(err); 
      dispatch(alert({ header: 'Socket.io error', message: "Cannot subscribe to server events" }));
    });

    socket.on('connect', () => {
      console.log("socket.IO connected ..."); 
      commError = false;
      dispatch(connected(socket));

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
      socket.on(name, data => dispatch(action(data)) );
    }

    function register(name, fct){
      socket.on(name, fct);
    }

    function updatePerson(data){
      dispatch(personsActions.updateCompleted(data.previous, data.current));
    }

    function updateCompany(data){
      //dispatch(companiesActions.updateCompleted(data.previous, data.current));
      dispatch(companiesActions.updateCompleted(data.current));
    }

    function updateNote(data){
      dispatch(notesActions.updateCompleted(data.previous, data.current));
    }

    function updateMission(data){
      dispatch(missionsActions.updateCompleted(data.previous, data.current));
    }

  }
}


export function disconnect(){
  return (dispatch, getState) => {
    const state = getState();
    dispatch( {type: DISCONNECTED} );
    if(state.socketIO.socket) state.socketIO.socket.disconnect();
  }
}

export const socketIOActions = { connect, disconnect };
