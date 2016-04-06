import {Route, RouteManager} from 'kontrolo'
import AgendaApp from '../containers/agenda/view.js'

const routes = RouteManager([
  Route({
    name: 'view',
    path: '/agenda',
    topic: 'agenda',
    label: 'Agenda',
    component: AgendaApp,
    isMenu: 5,
    iconName: 'calendar',
    authRequired: true
  }),
], {name: 'agenda'})

export default routes;
