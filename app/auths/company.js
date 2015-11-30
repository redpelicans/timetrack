import {AuthManager, Auth} from 'kontrolo';

export default AuthManager([
  Auth({
    name: 'delete',
    roles: ['admin'],
    method: function(user, context){
      if(!context.company) return false;
      return !context.company.get('personIds').size;
    }
  }),
  Auth({
    name: 'togglePreferred',
    roles: ['admin'],
  }),
  Auth({
    name: 'leave',
    roles: ['admin'],
  }),
], {name: 'company'});
