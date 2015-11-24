import errors from '../models/errors';

export function parseJSON(res) {
  return res.json()
}

export function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res
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
      credentials: 'same-origin',
    });
  else
    promise = fetchJson(uri, {
      method: verb,
      credentials: 'same-origin',
      headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(body||{})
    });

   promise.catch( err => {
      console.error(err.toString());
      errors.alert({
        header: header,
        message: message,
      });
   });

   return promise;
}

export function fetchJson(...params){
  return fetch(...params).then(checkStatus).then(parseJSON);
}

