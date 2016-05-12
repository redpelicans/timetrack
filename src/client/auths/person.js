import {AuthManager, Auth} from 'kontrolo';
import {isAdmin, isWorker} from '../lib/user'

export default AuthManager([
  Auth({
    name: 'delete',
    roles: ['admin', 'edit', 'person.edit'],
    method: function(user, getState, context){
      if(!context.person) return false
      return isAdmin(user) || !isWorker(context.person)
    }
  }),
  Auth({
    name: 'togglePreferred',
    roles: [],
  }),
  Auth({
    name: 'add',
    roles: ['admin', 'edit', 'person.edit'],
  }),
], {name: 'person'});
