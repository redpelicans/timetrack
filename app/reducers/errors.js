import {ALERT} from '../actions/errors';

export default function errorReducer(state = {}, action) {
  switch(action.type){
    case ALERT:
      return {
        header: action.header,
        message: action.message,
      };
      default:
        return state;
  }
}


