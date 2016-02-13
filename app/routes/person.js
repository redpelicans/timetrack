import ListPersonApp from '../containers/person/list';
import {NewPersonApp, EditPersonApp} from '../views/person/edit';
import ViewPersonApp from '../containers/person/view';
import {Route, RouteManager} from 'kontrolo';

const routes = RouteManager([
  Route({
    name: 'list',
    path: '/people',
    topic:'people',
    label: 'People', 
    component: ListPersonApp,
    isMenu: 2,
    iconName: 'users',
    authRequired: true
  }),
  Route({
    name: 'new',
    path: '/person/new',
    topic:'people',
    component: NewPersonApp,
    authRoles: ['admin'],
  }),
  Route({
    name: 'edit',
    path: '/person/edit',
    topic:'people',
    component: EditPersonApp,
    authRoles: ['admin'],
  }),
  Route({
    name: 'view',
    path: '/person/view',
    topic:'people',
    component: ViewPersonApp,
  }),
], {name: 'person'});

export default routes;
