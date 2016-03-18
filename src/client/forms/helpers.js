import {requestJson} from '../utils';
import colors from '../utils/colors';

export const avatarTypes = [
  {key: 'color', value: 'Color Picker'}, 
  {key: 'url', value: 'Logo URL'}, 
  {key: 'src', value: 'Logo File'}
];

export function rndColor() {
  let index = Math.floor(Math.random() * colors.length);
  return colors[ index ];
}

export const avatarUrlValueChecker = (dispatch, getState) => (url, state) => {
  if(!url) return new Promise(resolve => resolve({checked: true}));
  return requestJson('/api/check_url', {dispatch, verb: 'post', body: {url: url}})
    .then( res => {
      return { 
        checked: res.ok, 
        error: !res.ok && "Wrong URL!" 
      };
    });
}

export const emailUniqueness = (dispatch, getState) => (email, person={}) => {
  if(!email || person.email === email) return new Promise(resolve => resolve({checked: true}));
  return requestJson('/api/person/check_email_uniqueness', {dispatch, verb: 'post', body: {email: email}})
  .then( res => {
    return { 
      checked:  res.ok, 
      error: !res.ok && "Email already exists!" 
    };
  });
}



