import {CONNECTED, DISCONNECTED} from '../actions/socketIO';

function socketIOReducer(state={}, action){
  switch(action.type){
    case CONNECTED:
      return {socket: action.socket};
    case DISCONNECTED:
      return {socket: undefined};
    default:
      return state;
  }
}

export default socketIOReducer;
