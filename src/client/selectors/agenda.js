import Immutable from 'immutable';
import moment from 'moment';
import {createSelector} from 'reselect'
import {dmy} from '../utils'

const agenda = state => state.agenda
const events = state => state.events.data
const persons = state => state.persons.data
const missions = state => state.missions.data
const pendingRequests = state => state.pendingRequests

const byType = type => x => x.get('type') === type

export const agendaSelector = createSelector(
  agenda,
  events,
  persons,
  missions,
  pendingRequests,
  (agenda, events, persons, missions, pendingRequests) => {
    return {
      agenda,
      events: filteredEvents(agenda, events),
      workers:  persons.filter(byType('worker')),
      missions,
      persons,
      isLoading: !!pendingRequests
    }
  }
)

const eventsDays = event => {
  let day = moment(event.get('startDate')).clone();
  const days = [];
  while(day < event.get('endDate')){
    days.push(day.clone());
    day.add(1, 'day');
  }
  return days;
}

const filteredEvents = (agenda, events) => {
  const from = agenda.from.clone().subtract(10, 'days')
  const to = agenda.to.clone().add(10, 'days')
  return events
    .filter(event => {
      return event.get('startDate') <= to && event.get('endDate') >= from
    })
    .filter(event => {
      return agenda.workerIds.length === 0 || agenda.workerIds.indexOf(event.get('workerId')) !== -1
    })
    .filter(event => {
      return agenda.missionIds.length === 0 || agenda.missionIds.indexOf(event.get('missionId')) !== -1
    })
    .reduce((res, event) => {
      eventsDays(event).forEach( day => {
        const key = dmy(day);
        res = res.get(key) ? res.update(key, v => v.push(event)) : res.set(key, Immutable.fromJS([event]));
      });
      return res;
    }, Immutable.Map());
}
