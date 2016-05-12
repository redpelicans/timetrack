import {AuthManager, Auth} from 'kontrolo';
import personAuthManager from './person';
import companyAuthManager from './company';
import missionAuthManager from './mission';
import notesAuthManager from './notes';
import eventAuthManager from './event';


export default function registerAuthManager({getState}, routes){

  const loginSelector = () => {
    const {login: {user}} = getState()
    return {
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
  }

  return AuthManager(
    [ 
      personAuthManager, 
      companyAuthManager, 
      missionAuthManager, 
      notesAuthManager, 
      eventAuthManager 
    ], {
      loginSelector,
      getState,
      routes
    })
}

