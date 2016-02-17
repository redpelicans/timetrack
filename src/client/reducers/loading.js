import {START_LOADING, STOP_LOADING} from '../actions/loading';

export default function loadingReducer(state = 0, action) {
  switch(action.type){
    case START_LOADING:
      return state + 1;
    case STOP_LOADING:
      return state - 1;
    default:
      return state;
  }
}


