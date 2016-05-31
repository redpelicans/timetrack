import {Route, RouteManager} from 'kontrolo'
import {NewEventApp, EditEventApp} from '../containers/event/edit.js'
import {isAdmin, isManager} from '../lib/person'

const routes = RouteManager([
  Route({
    name: 'new',
    path: '/event/new',
    topic:'agenda',
    component: NewEventApp,
    authRequired: true,
  }),
  Route({
    name: 'edit',
    path: '/event/edit',
    topic:'agenda',
    component: EditEventApp,
    authMethod: (user, getState, {event}={}) => {
      const {events, persons, missions, routing} = getState()
      const eventId = routing.location.state && routing.location.state.eventId
      const targetEvent = event ? events.data.get(event._id) : eventId && events.data.get(eventId)
      if(!targetEvent) return false;
      if(targetEvent.get('status') === 'locked') return false
      if(isAdmin(user)) return true;
      if(targetEvent.get('status') !== 'toBeValidated') return false
      if(targetEvent.get('workerId') === user.get('_id')) return true
      const mission = missions.data.get(targetEvent.get('missionId'))
      if(!mission)return false
      return isManager(user, mission)
    }
  })
], {name: 'event'})

export default routes;
