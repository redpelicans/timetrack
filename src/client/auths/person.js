import {AuthManager, Auth} from 'kontrolo';
import {isAdmin, isWorker, hasMissions, hasEvents} from '../lib/person'

export default AuthManager([
  Auth({
    name: 'delete',
    roles: ['admin', 'edit', 'person.edit'],
    method: function(user, getState, {person}={}){
      if(!person) return false
      if(!isAdmin(user) && isWorker(person)) return false
      const state = getState()
      if(hasMissions(person, state.missions.data)) return false
      if(hasEvents(person, state.events.data)) return false
      return true
    }
  }),
  Auth({
    name: 'togglePreferred',
    roles: [],
  }),
], {name: 'person'});
