import {Route, RouteManager} from 'kontrolo'
import {NewEventApp, EditEventApp} from '../containers/event/edit.js'

const routes = RouteManager([
  Route({
    name: 'new',
    path: '/event/new',
    topic:'agenda',
    component: NewEventApp,
    authRoles: ['admin'],
  }),
  Route({
    name: 'edit',
    path: '/event/edit',
    topic:'agenda',
    component: EditEventApp,
    authRoles: ['admin'],
    authMethod: function(user, {mission}={}){
      if(!mission) return true;
      return mission.get('status') !== 'locked';
    }
  }),

], {name: 'event'})

export default routes;
