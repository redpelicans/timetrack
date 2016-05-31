import Immutable from 'immutable';
import moment from 'moment';
import {createSelector} from 'reselect'
import {MonthOrganizer, agendaPeriod} from '../lib/agenda'

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
      events: organizeEvents(filterEvents(agenda, events)),
      workers:  persons.filter(byType('worker')),
      missions,
      persons,
      isLoading: !!pendingRequests
    }
  }
)

// const eventDays = event => {
//   let day = moment(event.get('startDate')).clone();
//   const days = [];
//   while(day < event.get('endDate')){
//     days.push(day.clone());
//     day.add(1, 'day');
//   }
//   return days;
// }


const filterEvents = (agenda, events) => {
  const {from, to} = agendaPeriod(agenda.date)
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
}

const organizeEvents = (events) => {
  const organizer = new MonthOrganizer(events.toJS())
  return organizer.events()
}

// const key = dmy(day);
// res = res.get(key) ? res.update(key, v => v.push(event)) : res.set(key, Immutable.fromJS([event]));
