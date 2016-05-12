import _ from 'lodash'
import moment from 'moment'
import Immutable from 'immutable'
import {isAdmin, managedMissions, workedMissions} from './user'

export const eventPeriod = event => {
  let day = moment(event.startDate).clone()
  const days = []
  while(day < event.endDate){
    days.push(day.clone())
    day.add(1, 'day')
  }
  return days
}


export const eventDuration = event => {
  return event.endDate.diff(event.startDate, 'days')
}

export const isWeekend = (date) => {
  return date.isoWeekday() >= 6
}

export const isSunday = (date) => {
  return date.isoWeekday() === 7
}

export const authorizedWorkers = (user, workers, missions) => {
  if(isAdmin(user)) return workers
  return managedMissions(user, missions).reduce( (res, mission) =>{
      mission.get('workerIds').forEach( id => res = res.set(id, workers.get(id)) )
      return res
    }, 
    Immutable.Map().set(user.get("_id"), user) 
  )
}

export const authorizedMissions = (user, workers, missions) => {
  if(isAdmin(user)) return missions
  return managedMissions(user, missions).merge(workedMissions(user, missions))
}
