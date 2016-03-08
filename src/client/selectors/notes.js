import {createSelector} from 'reselect';
import _ from 'lodash';

const notes = state => state.notes;
const entity = (state, props) => props.entity;
const persons = state => state.persons.data;
const companies = state => state.companies.data;
const missions = state => state.missions.data;

export const notesSelector = createSelector(
  entity,
  notes,
  persons,
  (entity, notes, persons) => {
    return {
      notes: filterAndSortNotes(notes, entity),
      entity,
      persons,
    }
  }
)

function filterAndSortNotes(notes, entity){
  return notes.data.filter(note => note.get('entityId') === entity.get('_id'));
}

export const allNotesSelector = createSelector(
  notes,
  persons,
  companies,
  missions,
  (notes, persons, companies, missions) => {
    return {
      notes: notes.data,
      filter: notes.filter,
      sortCond: notes.sortCond,
      persons,
      companies,
      missions,
    }
  }
)

export const visibleNotesSelector = createSelector(
  notes,
  persons,
  companies,
  missions,
  (notes, persons, companies, missions) => {
    return {
      notes: getVisibleNotes(notes.data, notes.filter),
      filter: notes.filter,
      sortCond: notes.sortCond,
      persons,
      companies,
      missions,
    }
  }
)

const getVisibleNotes = (notes, filter) => {
  return notes.filter(filterForSearch(filter))
}

const filterForSearch = (filter) => {
  function filterByContent(key, content) {
    return content.indexOf(key) !== -1;
  }

  const keys = _.chain(filter.split(' ')).compact().map(key => key.toLowerCase()).value();
  return note => {
    const content = note.get('content')
    return _.every(keys, key => filterByContent(key, content))
  }
}
