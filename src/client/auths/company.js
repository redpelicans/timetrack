import {AuthManager, Auth} from 'kontrolo';
import {isAdmin, isWorker} from '../lib/user'
import {isTenant} from '../lib/company'

export default AuthManager([
  Auth({
    name: 'delete',
    roles: ['admin', 'edit', 'company.edit'],
    method: function(user, getState, context){
      if(!context) return false
      if(!context.company) return false
      if(context.workers && context.workers.size) return false
      if(!isAdmin(user) && isTenant(context.company))return false
      return true
    }
  }),
  Auth({
    name: 'togglePreferred',
  }),
  Auth({
    name: 'leave',
    roles: ['admin', 'edit', 'company.edit'],
    method: function(user, getState, context){
      if(!context || !context.company || !context.person) return false
      if(!isAdmin(user) && isTenant(context.company))return false
      if(!isAdmin(user) && isWorker(context.person))return false
      return true
    }
  }),
  Auth({
    name: 'add',
    roles: ['admin', 'edit', 'company.edit'],
  }),
], {name: 'company'});
