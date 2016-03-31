import Immutable from 'immutable';
import _ from 'lodash';

import {
  FILTER_TAGS,
  SORT_PERSONS,
} from '../actions/tagList';

const initialState = {
  filter: '',
  sortCond: {
    by: 'name',
    order: 'asc'
  },
}

export default function tagListReducer(state = initialState, action) {
  switch(action.type) {
    case FILTER_TAGS:
      return {
      ...state,
      filter: action.filter,
    }
    case SORT_PERSONS:
      const sortCond = {
      by: action.by,
      order: state.sortCond.by === action.by ? {asc: 'desc', desc: 'asc'}[state.sortCond.order] : state.sortCond.order,
    }
    return {
      ...state,
      sortCond
    }
    default: 
      return state
  }
}
