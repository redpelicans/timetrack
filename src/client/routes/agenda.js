import {Route, RouteManager} from 'kontrolo'
import AgendaApp from '../containers/agenda.js'

const routes = RouteManager([
  Route({
    name: 'calendar',
    path: '/agenda',
    topic: 'agenda',
    label: 'Agenda',
    component: AgendaApp,
    isMenu: 5,
    iconName: 'calendar',
    authRequired: true
  })
], {name: 'agenda'});

export default routes;
