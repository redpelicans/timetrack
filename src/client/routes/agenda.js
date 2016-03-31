import ListAgendaApp from '../containers/agenda/list';
import {Route, RouteManager} from 'kontrolo';

const routes = RouteManager([
  Route({
    name: 'list',
    path: '/agenda',
    topic:'agenda',
    label: 'Agenda', 
    component: ListAgendaApp,
    isMenu: 4,
    iconName: 'calendar',
    authRequired: true
  }),
], {name: 'agenda'});

export default routes;
