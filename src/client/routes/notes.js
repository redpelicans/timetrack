import ListNotesApp from '../containers/notes/list.js';
import {Route, RouteManager} from 'kontrolo';

const routes = RouteManager([
  Route({
    name: 'list',
    path: '/notes',
    defaultRoute: false,
    topic: 'notes',
    label: 'Notes',
    component: ListNotesApp,
    isMenu: 4,
    iconName: 'newspaper-o',
    authRequired: true
  })
], {name: 'notes'});

export default routes;
