import Immutable from 'immutable';
import {
  COMPANY_CREATED, 
  COMPANY_DELETED, 
  COMPANY_UPDATED, 
  COMPANIES_LOADED, 
  LOAD_COMPANIES, 
  FILTER_COMPANIES, 
  SORT_COMPANIES, 
  TOGGLE_PREFERRED_FILTER,
  COMPANY_TOGGLE_PREFERRED_COMPLETED,
  UPDATE_TAGS_COMPLETED,
} from '../actions/companies';

const initialState = {
  data: Immutable.Map(),
  filter: '',
  filterPreferred: false,
  sortCond: {
     by: 'name',
     order: 'asc'
  },
};

export default function companiesReducer(state = initialState, action) {
  switch(action.type){
    case UPDATE_TAGS_COMPLETED:
      return {
        ...state,
        data: state.data.update(action.id, p =>  p.set('tags', action.tags )),
      }
    case COMPANY_TOGGLE_PREFERRED_COMPLETED:
      return {
        ...state,
        data: state.data.update(action.id, p =>  p.set('preferred', action.preferred)),
      }
    case COMPANY_DELETED:
      return {
        ...state,
        data: state.data.delete( action.id ),
      }
    case COMPANY_UPDATED:
    case COMPANY_CREATED:
      return {
        ...state,
        data: state.data.set(action.company.get('_id'), action.company),
      }
    case FILTER_COMPANIES:
      return {
        ...state,
        filter: action.filter
      }
    case SORT_COMPANIES:
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
    case COMPANIES_LOADED:
      return {
        ...state,
        data: action.companies
      }
    default: 
      return state;
  }
}
