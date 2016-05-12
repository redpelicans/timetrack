import Immutable from 'immutable';
import moment from 'moment';
import {createSelector} from 'reselect'
import {dmy} from '../utils'
import {authorizedMissions, authorizedWorkers} from '../lib/event'

const agenda = state => state.agenda
const events = state => state.events.data
const persons = state => state.persons.data
const workers = state => state.persons.data.filter(byType('worker'))
const missions = state => state.missions.data
const from = state => state.routing.location.state && state.routing.location.state.from || moment()
const to = state => state.routing.location.state && state.routing.location.state.to || moment()
const eventId = state => state.routing.location.state && state.routing.location.state.eventId
const user = state => state.login.user

const byType = type => x => x.get('type') === type
const calcValue = (from, to, agenda)  => to.diff(from, agenda.defaultUnit) + 1
const calcValueWithoutDaysOff = (from, to, agenda)  => {
  const current = from.clone();
  let diff = 0;
  while(current <=  to){
    if(current.day() !== 0 && current.day() !== 6) diff++;
    current.add(1, agenda.defaultUnit)
  }
  return diff;
}


export const editEventSelector = createSelector(
  eventId,
  events,
  agenda,
  missions,
  workers,
  user,
  (eventId, events, agenda, missions, workers, user) => {
    return {
      missions,
      workers,
      authorizedWorkers: authorizedWorkers(user, workers, missions),
      authorizedMissions: authorizedMissions(user, workers, missions),
      event: events.get(eventId),
    }
  }
)

export const newEventSelector = createSelector(
  from,
  to,
  agenda,
  missions,
  workers,
  user,
  (from, to, agenda, missions, workers, user) => {
    return {
      workers,
      missions,
      authorizedWorkers: authorizedWorkers(user, workers, missions),
      authorizedMissions: authorizedMissions(user, workers, missions),
      from,
      to,
      unit: agenda.defaultUnit,
      value: calcValueWithoutDaysOff(from, to, agenda)
    }
  }
)
