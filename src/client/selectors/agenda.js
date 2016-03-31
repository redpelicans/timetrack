import {createSelector} from 'reselect'

const agenda = state => state.agenda
const events = state => state.events.data
const persons = state => state.persons.data
const missions = state => state.missions.data
const pendingRequests = state => state.pendingRequests

export const agendaSelector = createSelector(
  agenda,
  events,
  persons,
  missions,
  pendingRequests,
  (agenda, events, persons, missions, pendingRequests) => {
    return {
      agenda,
      events,
      persons,
      missions,
      isLoading: !!pendingRequests
    }
  }
)
