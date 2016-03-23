import {requestJson} from '../utils';
import Immutable from 'immutable';

export const SKILLS_LOADED = 'SKILLS_LOADED';

function skillsLoaded(skills){
  return{
    type: SKILLS_LOADED,
    skills: Immutable.fromJS(skills),
  }
}

export function loadSkills(){
  return (dispatch, getState) => {
    requestJson('/api/skills', {dispatch, message: 'Cannot load skills, check your backend server'})
      .then( skills => dispatch(skillsLoaded(skills)));
  }
}

export const skillsActions = { 
  load: loadSkills,
}

