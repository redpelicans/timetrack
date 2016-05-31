import {AuthManager, Auth} from 'kontrolo';
import {hasEvents} from '../lib/mission'

export default AuthManager([
  Auth({
    name: 'delete',
    roles: ['admin'],
    method: function(user, getState, {mission}){
      if(!mission) return false;
      const state = getState()
      return !hasEvents(mission, state.events.data);
    }
  }),
  Auth({
    name: 'close',
    roles: ['admin'],
  }),
], {name: 'mission'});
