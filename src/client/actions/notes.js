import moment from 'moment';
import _ from 'lodash';
import {requestJson} from '../utils';
import Immutable from 'immutable';

export const NOTES_LOADED = 'NOTES_LOADED';
export const NOTE_DELETED = 'NOTE_DELETED';
export const NOTE_UPDATED = 'NOTE_UPDATED';
export const NOTE_CREATED = 'NOTE_CREATED';
export const FILTER_NOTES = 'FILTER_NOTES';
export const ALL_LOADED   = 'ALL_LOADED';
export const SORT_NOTES   = 'SORT_NOTES';

export function allDataLoaded() {
  return {
    type: ALL_LOADED
  }
}

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

export function updateCompleted(note){
  return {
    type: NOTE_UPDATED,
    note: Immutable.fromJS(Maker(note)),
  }
}

export function createNote(note, entity){
  return (dispatch, getState) => {
    if (entity) {
      note.entityId = entity._id;
      note.entityType = entity.typeName;
    }
    requestJson('/api/notes', {dispatch, verb: 'post', body: {note}, message: 'Cannot create a note, check your backend server'})
      .then( note => dispatch(createCompleted(note)));
  }
}

export function deleteNote(note){
  return (dispatch, getState) => {
    requestJson(`/api/note/${note._id}`, {dispatch, verb: 'delete', message: 'Cannot delete note, check your backend server'})
      .then( res => dispatch(deleteCompleted(note)));
  }
}

export function updateNote(previous, updates){
  return (dispatch, getState) => {
    const next = {...previous, ...updates};
    next.entityId = next.entityId || null;
    requestJson('/api/note', {dispatch, verb: 'put', body: {note: next}, message: 'Cannot update note, check your backend server'})
      .then( note => dispatch(updateCompleted(note)));
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

    requestJson('/api/notes', {dispatch, message: 'Cannot load notes, check your backend server'})
      .then( notes => dispatch(notesLoaded(notes)));
  }
}

export function filterNotes(filter) {
  return {
    type: FILTER_NOTES,
    filter,
  }
}

export function sortNotes(by) {
  return {
    type: SORT_NOTES,
    by,
  }
}

export const notesActions = {
  load: loadNotes,
  create: createNote,
  update: updateNote,
  delete: deleteNote,
  filter: filterNotes,
  sort: sortNotes,
  createCompleted,
  updateCompleted,
  deleteCompleted,
}

function Maker(obj){
  obj.createdAt = moment(obj.createdAt);
  if(obj.updatedAt) obj.updatedAt = moment(obj.updatedAt);
  if(obj.dueDate) obj.dueDate = moment(obj.dueDate).toDate();
  return obj;
}
