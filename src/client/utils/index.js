require('universal-fetch');
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

export function requestJson(uri, {dispatch=new Function(), getState, token, verb='get', header='Runtime Error', body, message='Check your backend server'} = {}){
  let  promise;
  const absoluteUri = window.location ? window.location.origin + uri : uri;
  // care with test context
   const {login: {appJwt, sessionId, forceCookie}} = getState ? getState() : {login: {}};
   if(forceCookie) token = appJwt; 

  const options = {
    method: verb,
    credentials: 'same-origin',
    headers:{
    //   'X-Token-Access': appJwt,
    'X-SessionId': sessionId,
    },
  }

  // isomorphic request
  if(token) options.headers.Cookie = `timetrackToken=${token};`;

  dispatch(startLoading());

  if(!body) promise = fetchJson(absoluteUri, options);
  else{
    options.body = JSON.stringify(body||{});
    options.headers = {
      ...options.headers, 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    promise = fetchJson(absoluteUri, options);
  }

  return promise
    .then(res => {
      dispatch(stopLoading());
      return res;
    })
    .catch( err => {
      console.error(err.toString());
      dispatch(stopLoading());
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
}

export function fetchJson(...params){
  return fetch(...params).then(checkStatus).then(parseJSON);
}

export function dmy(date){ return date && date.format("DDMMYY")}
