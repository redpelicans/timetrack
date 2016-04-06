import Immutable from 'immutable';
import moment from 'moment';
import {createSelector} from 'reselect'
import {dmy} from '../utils'

const agenda = state => state.agenda
const events = state => state.events.data
const persons = state => state.persons.data
const missions = state => state.missions.data
const from = state => state.routing.location.state && state.routing.location.state.from || moment()
const to = state => state.routing.location.state && state.routing.location.state.to || moment()
const eventId = state => state.routing.location.state && state.routing.location.state.eventId

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
  persons,
  (eventId, events, agenda, missions, persons) => {
    return {
      missions,
      workers:  persons.filter(byType('worker')),
      event: events.get(eventId),
    }
  }
)

export const newEventSelector = createSelector(
  from,
  to,
  agenda,
  missions,
  persons,
  (from, to, agenda, missions, persons) => {
    return {
      workers:  persons.filter(byType('worker')),
      missions,
      from,
      to,
      unit: agenda.defaultUnit,
      value: calcValueWithoutDaysOff(from, to, agenda)
    }
  }
)
