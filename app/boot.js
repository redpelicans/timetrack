import {parseJSON} from './utils';
import {loginStore, loginActions} from './models/login';

export default function boot(){
  const jwt = localStorage.getItem('access_token');

  if(!jwt)  return new Promise(resolve => resolve());

  const options = {
    headers:{
      'X-Token-Access': jwt,
    }
  };

  return fetch(`/user`, options).then( res => {
    if (res.status >= 200 && res.status < 300){
      return res.json().then(user => {
        console.log("Already logged")
        loginActions.loggedIn.sync = true;
        loginActions.loggedIn(user, jwt);
      })
    }
  });

}

