import {AuthManager, Auth} from 'kontrolo';
import {isAdmin, isManager} from '../lib/person'

export default AuthManager([
  Auth({
    name: 'delete',
    required: true,
    method: (user, getState, {event}={}) => {
      const {events, missions, routing} = getState()
      if(!event) return false;
      if(event.get('status') === 'locked') return false
      if(isAdmin(user)) return true;
      if(event.get('status') !== 'toBeValidated') return false
      if(event.get('workerId') === user.get('_id')) return true
      const mission = missions.data.get(event.get('missionId'))
      if(!mission)return false
      return isManager(user, mission)
    }

  }),
], {name: 'event'});
