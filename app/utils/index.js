import {alert} from '../actions/errors';
import {startLoading, stopLoading} from '../actions/loading';
import {gotoLogin} from '../actions/routes';
import {logout} from '../actions/login';

export function parseJSON(res) {
  return res.json && res.json() || res;
}

export function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  } else if(res.status === 403){
    var error = new Error("Insufficient privilege, you cannot access this page")
    error.res = res
    throw error
  } else if(res.status === 401){
    var error = new Error("Unauthorized access")
    error.res = res
    throw error
  } else {
    var error = new Error(res.statusText)
    error.res = res
    throw error
  }
}

export function requestJson(uri, dispatch, getState, {verb='get', header='Runtime Error', body, message='Check your backend server'} = {}){
  let  promise;
  const {login: {appJwt, sessionId}} = getState();

  dispatch(startLoading());

  if(!body)
    promise = fetchJson(uri, { 
      method: verb,
      headers:{
        'X-Token-Access': appJwt,
        'X-SessionId': sessionId,
      },
    });
  else
    promise = fetchJson(uri, {
      method: verb,
      //credentials: 'same-origin',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Token-Access': appJwt,
        'X-SessionId': sessionId,
      },
      body: JSON.stringify(body||{})
    });

   promise
    .then(res => {
      dispatch(stopLoading());
      return res;
    })
    .catch( err => {
      dispatch(stopLoading());
      console.error(err.toString());
      switch(err.res.status){
        case 401:
          dispatch(alert({ header: err.message, message}));
          dispatch(logout()); 
        case 403:
          dispatch(alert({ header: err.message, message}));
          dispatch(gotoLogin()); 
        default:
          dispatch(alert({ header, message }));
      }
   });

   return promise;
}

export function fetchJson(...params){
  return fetch(...params).then(checkStatus).then(parseJSON);
}

