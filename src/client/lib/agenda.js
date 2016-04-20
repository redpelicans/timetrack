import moment from 'moment'
import _ from 'lodash'
import Immutable from 'immutable'
import {dmy} from '../utils'
import {eventPeriod, isWeekend, isSunday} from './event'

export const agendaPeriod = date => {
  const from = date.clone().startOf('month')
  const to = date.clone().endOf('month')
  return {
    from: from.subtract(from.day(), 'days').startOf('day'),
    to: to.add(6 - to.day(), 'days').endOf('day')
  }
}

export class MonthOrganizer{
  constructor(events){
    this._days = {}
    this.init(events)
    this.organize()
  }

  init(events){
    _.each(events, event => {
      _.each(eventPeriod(event), date => {
        if(!isWeekend(date)) this.register(date, event)
      })
    })
    return this
  }

  getDay(dmy){
    return this._days[dmy]
  }

  getSortedDmy(){
    return _.chain(this._days).sortBy(day => day.date).map(day => dmy(day.date)).value()
  }

  getYesterday(day){
    const yesterday = day.date.clone().subtract(1, 'day')
    return this._days[dmy(yesterday)]
  }


  setDay(dmy, dayOrganizer){
    this._days[dmy] = dayOrganizer
    return dayOrganizer
  }

  get dmys(){
    return _.keys(this._days)
  }

  organize(){
    _.each(this.getSortedDmy(), dmy => {
      const day = this.getDay(dmy)
      if(isSunday(day.date)) day.organize()
      else day.organize(this.getYesterday(day))
    })
    return this
  }

  register(date, event){
    let day = this.getDay(dmy(date))
    if(!day) day = this.setDay(dmy(date), new DayOrganizer(date))
    day.add(event)
    return this
  }

  events(){
    return _.reduce(this.dmys, (res, dmy) => {
      res[dmy] = this.getDay(dmy).events()
      return res
    }, {})
  }
}

class DayOrganizer{
  constructor(date){
    this.date = date
    this._events = {}
  }

  add(event){
    this._events[event._id] = {
      ...event, 
      startDate: moment(event.startDate), 
      endDate: moment(event.endDate), 
    }
    return event
  }

  get(event){
    return this._events[event._id]
  }

  organize(previous){
    this.spreadFromPrevious(previous)
    _.each(this.unallocatedSortedEvents(), event => {
      event.slot = this.availableSlots()[0]
    })
    return this
  }

  availableSlots(){
    const existing = _.chain(this.events()).map(event => event.slot).reject(e => e === undefined).value().sort()
    const all = Array.from(new Array(existing.length ? _.max(existing) + 2 : 1), (x, i) => i)
    return _.difference(all, existing)
  }

  unallocatedSortedEvents(){
    return _.chain(this.events()).reject(event => 'slot' in event).sortBy(event => event.value * -1).value()
  }

  spreadFromPrevious(previousDay){
    if(!previousDay) return this.tagAsFirstOfWeek()
    _.each(this.events(), event => {
      const previousEvent = previousDay.get(event)
      if(previousEvent){
        event.slot = previousEvent.slot
        if(isSunday(this.date)) event.firstOfWeek = true
      }else{
        event.firstOfWeek = true
      }
    })
    return this
  }

  tagAsFirstOfWeek(){
    _.each(this.events(), event =>  event.firstOfWeek = true )
    return this
  }

  events(){
    return _.values(this._events)
  }
}


