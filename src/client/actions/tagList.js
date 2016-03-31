import {requestJson} from '../utils'
import Immutable from 'immutable'

export const FILTER_TAGS = 'FILTER_TAGS'
export const SORT_PERSONS = 'SORT_PERSONS'

export function filter(filter) {
  return {
    type: FILTER_TAGS,
    filter
  }
}

export function sort(by){
  return {
    type: SORT_PERSONS,
    by
  }
}

export const tagListActions = { 
  filter,
  sort,
}
