import {AuthManager, Auth} from 'kontrolo';
import routes from '../routes';
import personAuthManager from './person';
import companyAuthManager from './company';
import missionAuthManager from './mission';
import notesAuthManager from './notes';


export default function registerAuthManager(store){
  let user;

  store.subscribe( () => {
    const state = store.getState();
    user = state.login.user;
  });

  const loginStore = {
    isLoggedIn(){
      return !!user;
    },

    getUserRoles(){
      return user ? user.get('roles').toJS() : [];
    },

    getUser(){
      return user;
    },
  }

  return AuthManager([ personAuthManager, companyAuthManager, missionAuthManager, notesAuthManager ], {loginStore});
}

