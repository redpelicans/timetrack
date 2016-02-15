import {requestJson} from '../utils';

export const colors = [ '#d73d32', '#CD4436', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080' ];

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
  return requestJson('/api/check_url', undefined, undefined, {verb: 'post', body: {url: url}})
    .then( res => {
      return { 
        checked: res.ok, 
        error: !res.ok && "Wrong URL!" 
      };
    });
}

export function emailUniqueness(email, person={}){
  if(!email || person.email === email) return new Promise(resolve => resolve({checked: true}));
  return requestJson('/api/person/check_email_uniqueness', undefined, undefined, { verb: 'post', body: {email: email}})
  .then( res => {
    return { 
      checked:  res.ok, 
      error: !res.ok && "Email already exists!" 
    };
  });
}



