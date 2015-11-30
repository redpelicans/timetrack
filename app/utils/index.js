import errors from '../models/errors';
import {navActions} from '../models/nav';
import {loginStore} from '../models/login';

export function parseJSON(res) {
  return res.json();
}

export function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  } else if(res.status === 401){
    var error = new Error("Insufficient privilege, you cannot access this page")
    error.res = res
    error.forceMessage = true;
    navActions.gotoLogin();
  } else if(res.status === 403){
    var error = new Error("Unauthorized access")
    error.res = res
    error.forceMessage = true;
    navActions.gotoUnAuth();
    throw error
  } else {
    var error = new Error(res.statusText)
    error.res = res
    throw error
  }
}

export function requestJson(uri, {verb='get', header='Runtime Error', body, message='Check your backend server'} = {}){
  let  promise;

  if(!body)
    promise = fetchJson(uri, { 
      method: verb,
      headers:{
        'X-Token-Access': loginStore.getJwt(),
      },
      //credentials: 'same-origin',
    });
  else
    promise = fetchJson(uri, {
      method: verb,
      //credentials: 'same-origin',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Token-Access': loginStore.getJwt(),
      },
      body: JSON.stringify(body||{})
    });

   promise.catch( err => {
      console.error(err.toString());
      if(err.forceMessage){
        errors.alert({ header: err.message });
      }else{
        errors.alert({ header: header, message: message });
      }
   });

   return promise;
}

export function fetchJson(...params){
  return fetch(...params).then(checkStatus).then(parseJSON);
}

