import _ from 'lodash'

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

export const getInitials = (name='') => {
  let parts = name.split(' ').slice(0, 3);
  return _.map(parts, part => part.substr(0,1).toUpperCase()).join('');
}

export const hasMissions = (person, missions) => {
  return missions.some(mission => mission.get('managerId') === person.get('_id') || mission.get('workerIds').includes(person.get('_id')))
}

export const hasEvents = (person, events) => {
  return events.some(event => event.get('workerId') === person.get('_id'))
}




