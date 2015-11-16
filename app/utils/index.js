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

export function requestJson(uri, verb, body){
  if(!body)
    return fetchJson(uri, { method: verb || 'get' });
  else
    return fetchJson(uri, {
      method: verb,
      headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(body||{})
    });
}

export function fetchJson(...params){
  return fetch(...params).then(checkStatus).then(parseJSON);
}

export function pushDataEvent(request, stream, manageError){
  request
  .then(data => {
    stream.push(data);
  })
  .catch(err => {
    if(manageError){
      manageError(err);
    }else{
      errors.alert({
        header: 'Communication Problem',
        message: 'Check your backend server'
      });
    }
  })
}

export function errorMgt(){
  return (err => {
    errors.alert({
      header: 'Communication Problem',
      message: err.toString() || 'Check your backend server'
    });
  });
}
