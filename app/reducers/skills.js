import Immutable from 'immutable';

import { SKILLS_LOADED } from '../actions/skills';

const initialState = Immutable.List();

export default function skillsReducer(state = initialState, action) {
  switch(action.type){
    case SKILLS_LOADED:
      return action.skills;
    default: 
      return state;
  }
}
