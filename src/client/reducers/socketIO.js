import {CONNECT, SOCKETIO_LOGIN, SOCKETIO_LOGOUT} from '../actions/socketIO';

function socketIOReducer(state={}, action){
  switch(action.type){
    case CONNECT:
      return {socket: action.socket};
    case SOCKETIO_LOGIN:
    case SOCKETIO_LOGOUT:
    default:
      return state;
  }
}

export default socketIOReducer;
