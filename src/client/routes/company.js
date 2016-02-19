import ListCompanyApp from '../containers/company/list';
import ViewCompanyApp from '../containers/company/view';
import {NewCompanyApp, EditCompanyApp} from '../containers/company/edit';
import {Route, RouteManager} from 'kontrolo';

const routes = RouteManager([
  Route({
    name: 'list',
    path: '/companies',
    defaultRoute: true,
    topic:'companies',
    label: 'Companies', 
    component: ListCompanyApp,
    isMenu: 1,
    iconName: 'building',
    authRequired: true
  }),
  Route({
    name: 'new',
    path: '/company/new',
    topic:'companies',
    component: NewCompanyApp,
    authRoles: ['admin'],
  }),
  Route({
    name: 'edit',
    path: '/company/edit',
    topic:'companies',
    component: EditCompanyApp,
    authRoles: ['admin'],
  }),
  Route({
    name: 'view',
    path: '/company/view',
    topic:'companies',
    component: ViewCompanyApp,
    authRequired: true
  }),
], {name: 'company'});

export default routes;