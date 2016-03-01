import {requestJson} from '../utils';
import Immutable from 'immutable';
import moment from 'moment';
import _ from 'lodash';

export const LOAD_PERSONS = 'LOAD_PERSONS';
export const PERSONS_LOADED = 'PERSONS_LOADED';
export const TOGGLE_PREFERRED_FILTER = 'TOGGLE_PREFERRED_FILTER';
export const SORT_PERSONS = 'SORT_PERSONS';
export const FILTER_PERSONS = 'FILTER_PERSONS';
export const PERSON_UPDATED = 'PERSON_UPDATED';
export const PERSON_DELETED = 'PERSON_DELETED';
export const PERSON_CREATED = 'PERSON_CREATED';
export const PERSON_TOGGLE_PREFERRED_COMPLETED = 'PERSON_TOGGLE_PREFERRED_COMPLETED';
export const PERSON_UPDATE_TAGS_COMPLETED = 'PERSON_UPDATE_TAGS_COMPLETED';

export function createCompleted(){
}

export function deleteCompleted(person){
  return {
    type: PERSON_DELETED,
    id: person._id
  }
}

export function createCompleted(person){
  return {
    type: PERSON_CREATED,
    person: Immutable.fromJS(Maker(person))
  }
}

export function updateCompleted(person){
  return {
    type: PERSON_UPDATED,
    person: Immutable.fromJS(Maker(person))
  }
}

function personsLoaded(persons){
  return {
    type: PERSONS_LOADED,
    persons: Immutable.fromJS(_.reduce(persons, (res, p) => { res[p._id] = Maker(p); return res}, {})),
  }
}

function togglePreferredCompleted(id, preferred){
  return {
    type: PERSON_TOGGLE_PREFERRED_COMPLETED,
    id,
    preferred
  }
}

export function filter(filter){
  return {
    type: FILTER_PERSONS,
    filter
  }
}

export function sort(by){
  return {
    type: SORT_PERSONS,
    by
  }
}

export function togglePreferred(person){
  return (dispatch, getState) => {
    const body = { id: person._id , preferred: !person.preferred};
    const message = 'Cannot toggle preferred status, check your backend server';
    const request = requestJson(`/api/people/preferred`, dispatch, getState, {verb: 'post', body, message});

    request.then( res => {
      const state = getState();
      dispatch(togglePreferredCompleted(res._id, body.preferred));
    });
  }
}

export function togglePreferredFilter(){
  return {
    type: TOGGLE_PREFERRED_FILTER
  }
}

export function loadPersons({forceReload=false, ids=[]} = {}){
  return (dispatch, getState) => {
    const state = getState();
    const objs = _.map(ids, id => state.persons.data.get(id));
    let doRequest = forceReload || !_.every(objs) || !state.persons.data.size;
    if(!doRequest) return;

    const url = '/api/people';
    dispatch({type: LOAD_PERSONS});
    requestJson(url, dispatch, getState, {message: 'Cannot load persons, check your backend server'})
      .then( persons => {
        dispatch(personsLoaded(persons));
      });
  }
}

export function deletePerson(person){
  return (dispatch, getState) => {
    const id = person._id;
    requestJson(`/api/person/${id}`, dispatch, getState, {verb: 'delete', message: 'Cannot delete person, check your backend server'})
      .then( res => dispatch(deleteCompleted(person)) );
  }
}

export function updatePerson(previous, updates){
  return (dispatch, getState) => {
    requestJson('/api/person', dispatch, getState, {verb: 'put', body: {person: _.assign({}, previous, updates)}, message: 'Cannot update person, check your backend server'})
      .then( person => {
        dispatch(updateCompleted(person));
      });
  }
}

export function createPerson(person){
  return (dispatch, getState) => {
    requestJson('/api/people', dispatch, getState, {verb: 'post', body: {person: person}, message: 'Cannot create person, check your backend server'})
      .then( person => {
        dispatch(createCompleted(person));
      });
  }
}

function updateTagsCompleted(person){
  return {
    type: PERSON_UPDATE_TAGS_COMPLETED,
    id: person._id,
    tags: Immutable.fromJS(person.tags)
  }
}

export function updateTags(person, tags){
  return (dispatch, getState) => {
    let body = { _id: person._id, tags }
    const message = 'Cannot update tags, check your backend server'
    let request = requestJson('/api/people/tags', dispatch, getState, {verb: 'post', body: body, message: message})

    request.then(person => dispatch(updateTagsCompleted(person)))
  }
}

export const personsActions = {
  updateTags,
  createCompleted,
  updateCompleted,
  deleteCompleted,
  load: loadPersons,
  create: createPerson,
  update: updatePerson,
  delete: deletePerson,
  togglePreferredFilter,
  togglePreferred,
  sort,
  filter,
}

function Maker(doc){
  doc.createdAt = moment(doc.createdAt);
  doc.typeName = "person";
  if(doc.updatedAt) doc.updatedAt = moment(doc.updatedAt);
  return doc;
}


