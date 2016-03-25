import {requestJson} from '../utils';
import Immutable from 'immutable';

export const FILTER_TAGS = 'FILTER_TAGS';

export function filter(filter) {
  return {
    type: FILTER_TAGS,
    filter
  }
}

export const tagListActions = { 
  filter,
}
