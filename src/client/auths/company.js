import {AuthManager, Auth} from 'kontrolo';
import {isAdmin, isWorker} from '../lib/person'
import {isTenant, hasMissions} from '../lib/company'

export default AuthManager([
  Auth({
    name: 'delete',
    roles: ['admin', 'edit', 'company.edit'],
    method: function(user, getState, {company, workers}={}){
      if(!company) return false
      if(workers && workers.size) return false
      const state = getState()
      if(hasMissions(company, state.missions.data)) return false
      if(!isAdmin(user) && isTenant(company))return false
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
