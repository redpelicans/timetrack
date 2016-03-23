import {Route, RouteManager} from 'kontrolo';
import NotFound from '../containers/notfound';
import LoginApp from '../containers/login';
import UnAuthorized from '../components/unauthorized';
import personRoutes from './person';
import companyRoutes from './company';
import missionRoutes from './mission';
import notesRoutes from './notes';
import tagsRoutes from './tags';

const routes = RouteManager([
  personRoutes,
  companyRoutes,
  missionRoutes,
  notesRoutes,
  tagsRoutes,
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
]);

export const TOTO=1;
export default routes;
