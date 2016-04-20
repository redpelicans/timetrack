import _ from 'lodash'
import moment from 'moment'

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
