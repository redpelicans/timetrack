import {AuthManager, Auth} from 'kontrolo';
import {isAdmin} from '../lib/person'

export default AuthManager([
  Auth({
    name: 'delete',
    method: function(user, getState, {note}={}){
      if(isAdmin(user)) return true
      return note.get('authorId') === user.get('_id')
    }
  }),
], {name: 'notes'});
