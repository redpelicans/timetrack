import _ from 'lodash'
import Immutable from 'immutable'
import {createSelector} from 'reselect'

const missions = state => state.missions.data
const filterSelector = state => state.missions.filter
const sortCondSelector = state => state.missions.sortCond
const persons = state => state.persons.data
const companies = state => state.companies.data
const pendingRequests = state => state.pendingRequests
const missionId = state => state.routing.location.state && state.routing.location.state.missionId
const clientId = state => state.routing.location.state && state.routing.location.state.clientId

const name = x => x.get('name')
const getClientsFilter = c => c.get('type') === 'client' || c.get('type') === 'partner'
const getWorkersFilter = p => p.get('type') === 'worker'

export const editMissionSelector = createSelector(
  missionId,
  missions,
  companies,
  persons,
  clientId,
  (missionId, missions, companies, persons, clientId) => {
    return {
      mission: missions.get(missionId),
      workers: persons.filter(getWorkersFilter).sortBy(name),
      clients: companies.filter(getClientsFilter).sortBy(name),
      clientId
    }
  }
)

export const newMissionSelector = createSelector(
  companies,
  persons,
  clientId,
  (companies, persons, clientId) => {
    return {
      clients: companies.filter(getClientsFilter).sortBy(name),
      workers: persons.filter(getWorkersFilter).sortBy(name),
      clientId
    }
  }
)

export const viewMissionSelector = createSelector(
  missionId,
  missions,
  persons,
  companies,
  pendingRequests,
  (missionId, missions, persons, companies, pendingRequests) => {
    const mission = missions.get(missionId)
    const isLoading = !!pendingRequests

    if (mission) { 
      return {
        mission,
        client: companies.get(mission.get('clientId')),
        manager: persons.get(mission.get('managerId')),
        workers: Immutable.fromJS(mission.get('workerIds').toJS().map(id => persons.get(id))),
        isLoading: isLoading
      }
    }
    else
      return {isLoading}
  }
)

export const visibleMissionsSelector = createSelector(
  missions,
  filterSelector,
  sortCondSelector,
  persons,
  companies,
  pendingRequests,
  (missions, filter, sortCond, persons, companies, pendingRequests) => {
    return {
      missions: filterAndSort(missions, companies, filter, sortCond),
      filter,
      sortCond,
      persons,
      companies,
      isLoading: !!pendingRequests
    }
  }
)

function filterAndSort(missions, companies, filter, sortCond){
  return missions
    .toSetSeq()
    .filter(filterForSearch(filter, companies))
    .sort( (a,b) => sortByCond(a, b, sortCond.by, sortCond.order));
}

function sortByCond(a, b, attr, order){
  return order === 'asc' ? sortBy(a, b, attr) : sortBy(b, a, attr);
}

function sortBy(a, b, attr){
  if( a.get(attr) === b.get(attr) ) return attr !== 'name' ? sortByCond(a,b, 'name', 'desc') : 0;
  if(attr != 'name') return a.get(attr) < b.get(attr) ? 1 : -1;
  return a.get(attr) > b.get(attr) ? 1 : -1;
}

function filterForPreferred(filter){
  return p => filter ? p.get('preferred') : true;
}

function filterForSearch(filter='', companies){
  return  p => {
    const company = companies.get(p.get('clientId'));
    const name = [p.get('name'), company && company.get('name')].join( ' ') ;
    return name.toLowerCase().indexOf(filter) !== -1;
  }
}


