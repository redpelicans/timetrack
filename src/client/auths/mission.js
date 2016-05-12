import {AuthManager, Auth} from 'kontrolo';

export default AuthManager([
  Auth({
    name: 'delete',
    roles: ['admin'],
    method: function(user, getState, {mission}){
      if(!mission) return false;
      return mission.get('status') !== 'closed';
    }
  }),
  Auth({
    name: 'close',
    roles: ['admin'],
  }),
], {name: 'mission'});
