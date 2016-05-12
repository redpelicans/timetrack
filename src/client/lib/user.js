import _ from 'lodash'
import Immutable from 'immutable'

export const hasSomeRoles = (user, roles) => _.chain(roles).difference(user.get('roles').toJS() || []).isEmpty().value();
export const isAdmin = user => hasSomeRoles(user, ['admin'])

export const managedMissions = (user, missions) => {
  const userId = user.get('_id')
  return missions.filter( mission => mission.get('managerId') === userId )
}

export const workedMissions = (user, missions) => {
  const userId = user.get('_id')
  return missions.filter( mission => mission.get('workerIds').find( id => id === userId ))
}

export const isManager = (user, mission) => {
  if(!mission) return false
  return mission.get('managerId') === user.get('_id')
}


export const isWorker = (user) => {
  return user.get('type') === 'worker'
}
