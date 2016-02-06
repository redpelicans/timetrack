import Immutable from 'immutable';
import {
  PERSON_CREATED, 
  PERSON_DELETED, 
  PERSON_UPDATED, 
  PERSONS_LOADED, 
  LOAD_PERSONS, 
  FILTER_PERSONS, 
  SORT_PERSONS, 
  TOGGLE_PREFERRED_FILTER,
  PERSON_TOGGLE_PREFERRED_COMPLETED,
} from '../actions/persons';

const initialState = {
  data: Immutable.Map(),
  filter: '',
  filterPreferred: false,
  sortCond: {
     by: 'name',
     order: 'asc'
  },
};

export default function personsReducer(state = initialState, action) {
  switch(action.type){
    case PERSON_TOGGLE_PREFERRED_COMPLETED:
      return {
        ...state,
        data: state.data.update(action.id, p =>  p.set('preferred', action.preferred)),
      }
    case PERSON_DELETED:
      return {
        ...state,
        data: state.data.delete( action.id ),
      }
    case PERSON_UPDATED:
    case PERSON_CREATED:
      return {
        ...state,
        data: state.data.set(action.person.get('_id'), action.person),
      }
    case FILTER_PERSONS:
      return {
        ...state,
        filter: action.filter
      }
    case SORT_PERSONS:
      const sortCond = {
        by: action.by,
        order: state.sortCond.by === action.by ? {asc: 'desc', desc: 'asc'}[state.sortCond.order] : state.sortCond.order,
      };
      return {
        ...state,
        sortCond
      }
    case TOGGLE_PREFERRED_FILTER:
      return {
        ...state,
        filterPreferred: !state.filterPreferred
      }
    case PERSONS_LOADED:
      return {
        ...state,
        data: action.persons
      }
    default: 
      return state;
  }
}
