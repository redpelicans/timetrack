import ListNotesApp from '../containers/notes/list.js';
import {NewNoteApp, EditNoteApp} from '../containers/notes/edit.js'
import {Route, RouteManager} from 'kontrolo';
import {isAdmin} from '../lib/person'

const routes = RouteManager([
  Route({
    name: 'list',
    path: '/notes',
    topic: 'notes',
    label: 'Notes',
    component: ListNotesApp,
    isMenu: 5,
    iconName: 'newspaper-o',
    authRequired: true
  }),
  Route({
    name: 'new',
    path: '/note/new',
    topic: 'notes',
    component: NewNoteApp,
    authRequired: true
  }),
  Route({
    name: 'edit',
    path: '/note/edit',
    topic: 'notes',
    component: EditNoteApp,
    authRequired: true,
    authMethod: function(user, getState, {note}={}){
      if(isAdmin(user)) return true
      if(!note){
        const state = getState()
        const noteId = state.routing.location.state && state.routing.location.state.noteId
        if(!noteId) return false
        note = state.notes.data.get(noteId)
      }
      if(!note) return false
      return note.get('authorId') === user.get('_id')
    }

  })
], {name: 'notes'});

export default routes;
