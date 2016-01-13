import {AuthManager, Auth} from 'kontrolo';

export default AuthManager([
  Auth({
    name: 'delete',
    roles: ['admin'],
    method: function(user, {mission}){
      if(!mission) return false;
      return mission.get('status') !== 'closed';
    }
  }),
  Auth({
    name: 'close',
    roles: ['admin'],
  }),
  Auth({
    name: 'add',
    roles: ['admin'],
  }),
], {name: 'mission'});
