'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _reselect = require('reselect');

var notes = function notes(state) {
  return state.notes;
};
var entity = function entity(state, props) {
  return props.entity;
};
var persons = function persons(state) {
  return state.persons.data;
};

var notesSelector = (0, _reselect.createSelector)(entity, notes, persons, function (entity, notes, persons) {
  return {
    notes: filterAndSortNotes(notes, entity),
    entity: entity,
    persons: persons
  };
});

exports.notesSelector = notesSelector;
function filterAndSortNotes(notes, entity) {
  return notes.filter(function (note) {
    return note.get('entityId') === entity.get('_id');
  });
}
//# sourceMappingURL=notes.js.map
