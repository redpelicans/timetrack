import Immutable from 'immutable';
import _ from 'lodash';

import {
  FILTER_TAGS,
} from '../actions/tagList';

const initialState = {
  filter: '',
}

export default function tagListReducer(state = initialState, action) {
  switch(action.type){
    case FILTER_TAGS:
      return {
        ...state,
        filter: action.filter,
      }
    default: 
      return state
  }
}
