import {checkStatus, parseJSON} from '../utils';

export const colors = [ '#d73d32', '#7e3794', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080' ];

export const avatarTypes = [
  {key: 'color', value: 'Color Picker'}, 
  {key: 'url', value: 'Logo URL'}, 
  {key: 'src', value: 'Logo File'}
];

export function rndColor() {
  let index = Math.floor(Math.random() * colors.length);
  return colors[ index ];
}

export function avatartarUrlValueChecker(url, state){
  if(!url) return new Promise(resolve => resolve({checked: true}));
  return fetch('/api/check_url', {
    method: 'post',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({url: url})
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(json => {
    return { 
      checked: json.ok, 
      error: !json.ok && "Wrong URL!" 
    };
  });
}

export function emailUniqueness(email){
  if(!email) return new Promise(resolve => resolve({checked: true}));
  return fetch('/api/person/check_email_uniqueness', {
    method: 'post',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: email})
  })
  .then(checkStatus)
  .then(parseJSON)
  .then(json => {
    return { 
      checked: json.ok, 
      error: !json.ok && "Email already exists!" 
    };
  });
}



