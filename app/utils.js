function parseJSON(res) {
  return res.json()
}

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  } else {
    var error = new Error(res.statusText)
    error.res = res
    throw error
  }
}

export function requestJson(url){
  return fetch(url).then(checkStatus).then(parseJSON);
}

