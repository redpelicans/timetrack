import moment from 'moment';
import {requestJson} from '../utils';
import Immutable from 'immutable';

export const NOTES_LOADED = 'NOTES_LOADED';
export const NOTE_DELETED = 'NOTE_DELETED';
export const NOTE_UPDATED = 'NOTE_UPDATED';
export const NOTE_CREATED = 'NOTE_CREATED';

export function createCompleted(note){
  return {
    type: NOTE_CREATED,
    note: Immutable.fromJS(Maker(note)),
  }
}

export function deleteCompleted(note){
  return {
    type: NOTE_DELETED,
    id: note._id,
  }
}

export function updateCompleted(previous, note){
  return {
    type: NOTE_UPDATED,
    note: Immutable.fromJS(Maker(note)),
  }
}

export function createNote(note, entity){
  return (dispatch, getState) => {
    note.entityId = entity._id;
    note.entityType = entity.typeName;
    requestJson('/api/notes', dispatch, getState, {verb: 'post', body: {note}, message: 'Cannot create a note, check your backend server'})
      .then( note => dispatch(createCompleted(note)));
  }
}

export function deleteNote(note){
  return (dispatch, getState) => {
    requestJson(`/api/note/${note._id}`, dispatch, getState, {verb: 'delete', message: 'Cannot delete note, check your backend server'})
      .then( res => dispatch(deleteCompleted(note)));
  }
}

export function updateNote(previous, updates){
  return (dispatch, getState) => {
    const next = {...previous, ...updates};
    requestJson('/api/note', dispatch, getState, {verb: 'put', body: {note: next}, message: 'Cannot update note, check your backend server'})
      .then( note => dispatch(updateCompleted(previous, note)));
  }
}

function notesLoaded(notes){
  return{
    type: NOTES_LOADED,
    notes: Immutable.fromJS(_.reduce(notes, (res, p) => { res[p._id] = Maker(p); return res}, {})),
  }
}

export function loadNotes({forceReload=false, ids} = {}){
  return (dispatch, getState) => {
    const state = getState();
    const objs = _.map(ids || [], id => state.notes.get(id));
    const doRequest = forceReload || !_.every(objs) || !state.notes.size;

    if(!doRequest) return;

    requestJson('/api/notes', dispatch, getState, {message: 'Cannot load notes, check your backend server'})
      .then( notes => dispatch(notesLoaded(notes)));
  }
}

export const notesActions = {
  load: loadNotes,
  create: createNote,
  update: updateNote,
  delete: deleteNote,
  createCompleted,
  updateCompleted,
  deleteCompleted,
}

function Maker(obj){
  obj.createdAt = moment(obj.createdAt);
  if(obj.updatedAt) obj.updatedAt = moment(obj.updatedAt);
  return obj;
}
