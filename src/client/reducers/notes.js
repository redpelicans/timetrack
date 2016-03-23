import Immutable from 'immutable';

import {
  NOTES_LOADED,
  NOTE_CREATED,
  NOTE_UPDATED,
  NOTE_DELETED,
  FILTER_NOTES,
  SORT_NOTES,
} from '../actions/notes';

const initialState = {
  data: Immutable.Map(),
  filter: '',
  sortCond: {
     by: 'createdAt',
     order: 'asc'
  },
}

export default function notesReducer(state = initialState, action) {
  switch(action.type){
    case NOTES_LOADED:
      return {
        ...state,
        data: action.notes,
      }
    case NOTE_DELETED:
      return {
        ...state,
        data: state.data.delete( action.id ),
      }
    case NOTE_UPDATED:
    case NOTE_CREATED:
      return {
        ...state,
        data: state.data.set(action.note.get('_id'), action.note),
      }
    case FILTER_NOTES:
      return {
        ...state,
        filter: action.filter,
      }
    case SORT_NOTES:
      const sortCond = {
        by: action.by,
        order: state.sortCond.by === action.by ? {asc: 'desc', desc: 'asc'}[state.sortCond.order] : state.sortCond.order,
      };
      return {
        ...state,
        sortCond,
      }
    default:
      return state;
  }
}
