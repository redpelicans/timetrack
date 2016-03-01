import {createSelector} from 'reselect';

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
  return notes.filter(note => note.get('entityId') === entity.get('_id'));
}

export const allNotesSelector = createSelector(
  notes,
  persons,
  (notes, persons) => {
    return {
      notes,
      persons
    }
  }
)
