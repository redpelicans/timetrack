import {parseJSON} from './utils';

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
        return {user, jwt};
      })
    }else{
      return;
    }
  });

}

