import ListNotesApp from '../containers/notes/list.js';
import {NewNoteApp, EditNoteApp} from '../containers/notes/edit.js'
import {Route, RouteManager} from 'kontrolo';

const routes = RouteManager([
  Route({
    name: 'list',
    path: '/notes',
    topic: 'notes',
    label: 'Notes',
    component: ListNotesApp,
    isMenu: 4,
    iconName: 'newspaper-o',
    authRequired: true
  }),
  Route({
    name: 'new',
    path: '/note/new',
    topic: 'notes',
    component: NewNoteApp,
    authRoles: ['admin'],
  }),
  Route({
    name: 'edit',
    path: '/note/edit',
    topic: 'notes',
    component: EditNoteApp,
    authRoles: ['admin'],
  })
], {name: 'notes'});

export default routes;
