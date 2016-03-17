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

export const newNoteSelector = createSelector(
  persons,
  companies,
  missions,
  (persons, companies, missions) => {
    return {
      persons,
      companies,
      missions,
    }
  }
)

export const editNoteSelector = createSelector(
  persons,
  companies,
  missions,
  (persons, companies, missions) => {
    return {
      persons,
      companies,
      missions,
    }
  }
)

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
      notes: getVisibleNotes(notes.data, notes.filter, notes.sortCond),
      filter: notes.filter,
      sortCond: notes.sortCond,
      persons,
      companies,
      missions,
    }
  }
)

const getVisibleNotes = (notes, filter, sort) => {
  return notes
    .toSetSeq()
    .filter(filterForSearch(filter))
    .sort( (a,b) => sortByCond(a, b, sort.by, sort.order));
}

function sortByCond(a, b, attr, order) {
  return order === 'asc' ? sortBy(a, b, attr) : sortBy(b, a, attr);
}

function sortBy(a, b, attr) {
<<<<<<< HEAD
=======
  if(attr === 'content') return a.get(attr).localeCompare(b.get(attr));
>>>>>>> 351a9fe1c6d2c8225cd10c43d00150f7c0331d01
  return a.get(attr) < b.get(attr) ? 1 : -1;
}

const filterForSearch = (filter) => {
  function filterByContent(key, content) {
    return content.toLowerCase().indexOf(key) !== -1;
  }

  const keys = _.chain(filter.split(' ')).compact().map(key => key.toLowerCase()).value();
  return note => {
    const content = note.get('content')
    return _.every(keys, key => filterByContent(key, content))
  }
}
