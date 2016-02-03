import {USER_LOGGED_IN, USER_LOGOUT} from '../actions/login';

function loginReducer(state={}, action){
  switch(action.type){
    case USER_LOGGED_IN:
      return {
       user: action.user,
       appJwt: action.appJwt,
       sessionId: action.sessionId,
      }
    case USER_LOGOUT:
      return {}
    default:
      return state;
  }
}

export default loginReducer;
