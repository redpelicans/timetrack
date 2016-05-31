import _ from 'lodash'

export const hasEvents = (mission, events) => {
  return events.some(event => event.get('missionId') === mission.get('_id'))
}


