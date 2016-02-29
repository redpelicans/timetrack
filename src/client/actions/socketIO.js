export const CONNECT = 'SOCKETIO_CONNECT';
export const SOCKETIO_LOGIN = 'SOCKETIO_LOGIN';
export const SOCKETIO_LOGOUT = 'SOCKETIO_LOGOUT';

export function connect(socket){
  return {
    type: CONNECT,
    socket
  }
}

export function login(){
  return (dispatch, getState) => {
    const state = getState();
    if(state.socketIO.socket){
      const {appJwt, sessionId} = state.login;
      state.socketIO.socket.send({type: 'login', token: appJwt, sessionId}, data => {
        if(data.status !== 'ok'){
          dispatch(alert({ header: 'Error', message: "Cannot subscribe to pushed events" }));
        }else{
          dispatch({type: SOCKETIO_LOGIN});
        }
      });
    }
  }
}

export function logout(){
  return (dispatch, getState) => {
    const state = getState();
    if(state.socketIO.socket) {
      state.socketIO.socket.send({type: 'logout'});
      dispatch({type: SOCKETIO_LOGOUT});
    }
  }
}

export const socketIOActions = { connect, login, logout };
