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

export function requestPostJson(uri, body){
  return requestJson(uri, {
    method: 'post',
    headers:{
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}

export function requestJson(...params){
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

