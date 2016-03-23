import {requestJson} from '../utils';
import Immutable from 'immutable';

export const TAGS_LOADED = 'TAGS_LOADED';
export const TAG_DETAILS_LOADED = 'TAG_DETAILS_LOADED'


function tagsLoaded(tags){
  return{
    type: TAGS_LOADED,
    tags: Immutable.fromJS(tags),
  }
}

export function loadTags(){
  return (dispatch, getState) => {
    requestJson('/api/tags', {dispatch, message: 'Cannot load tags, check your backend server'})
      .then( tags => dispatch(tagsLoaded(tags)));
  }
}

export const tagsActions = { 
  load: loadTags,
}

