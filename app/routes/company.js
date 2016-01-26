import ListCompanyApp from '../views/company/list';
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
], {name: 'company'});

export default routes;
