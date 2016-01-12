import {Route, RouteManager} from 'kontrolo';
import NotFound from '../views/not-found';
import UnAuthorized from '../views/unauthorized';
import LoginApp from '../views/login';
import personRoutes from './person';
import companyRoutes from './company';
import missionRoutes from './mission';
import authManager from '../auths';

const routes = RouteManager([
  personRoutes,
  companyRoutes,
  missionRoutes,
  Route({
    name: 'notfound',
    path: '/notfound',
    component: NotFound,
  }),
  Route({
    name: 'unauthorized',
    path: '/unauthorized',
    component: UnAuthorized,
  }),
  Route({
    name: 'login',
    path: '/login',
    component: LoginApp,
  }),
], {auth: authManager});

export default routes;
