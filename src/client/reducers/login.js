import {USER_LOGGED_IN, USER_LOGOUT} from '../actions/login';
import {
  PERSON_DELETED, 
  PERSON_UPDATED, 
} from '../actions/persons';

function loginReducer(state={}, action){
  switch(action.type){
    case PERSON_UPDATED:
      if(action.person.get('_id') === state.user.get('_id')){
        return {
          ...state,
          user: action.person
        }
      }else{
        return state
      }
    case USER_LOGGED_IN:
      return {
       user: action.user,
       appJwt: action.appJwt,
       sessionId: action.sessionId,
       forceCookie: action.forceCookie
      }
    case USER_LOGOUT:
      return {}
    default:
      return state;
  }
}

export default loginReducer;
