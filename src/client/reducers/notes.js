import Immutable from 'immutable';

import {
  NOTES_LOADED, 
  NOTE_CREATED,
  NOTE_UPDATED,
  NOTE_DELETED,
} from '../actions/notes';

const initialState = Immutable.Map();

export default function notesReducer(state = initialState, action) {
  switch(action.type){
    case NOTES_LOADED:
      return action.notes
    case NOTE_DELETED:
      return state.delete( action.id );
    case NOTE_UPDATED:
    case NOTE_CREATED:
      return state.set(action.note.get('_id'), action.note); 
    default: 
      return state;
  }
}
