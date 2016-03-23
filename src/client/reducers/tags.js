import Immutable from 'immutable';
import _ from 'lodash';

import { TAGS_LOADED } from '../actions/tags';

const initialState = Immutable.List();

export default function tagsReducer(state = initialState, action) {
  switch(action.type){
    case TAGS_LOADED:
      return action.tags;
    default: 
      return state;
  }
}
