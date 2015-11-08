import {Formo, Field, MultiField} from '../utils/formo';
import _ from 'lodash';
import {checkStatus, parseJSON} from '../utils';

export const colors = [ '#d73d32', '#7e3794', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080' ];

export const avatarTypes = {
  color: 'Color Picker', 
  url: 'Logo URL', 
  src: 'Logo File',
}

function rndColor() {
  let index = Math.floor(Math.random() * colors.length);
  return colors[ index ];
}

function avatartarUrlValueChecker(url, state){
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
    return json.ok;
  });
}

export default function company(document){
  return new Formo([
    new Field('name', {
      label: "Name",
      type: "text",
      required: true
    }),
    new Field('type', {
      label: "Type",
      defaultValue: 'Client',
      domainValues: ['Client', 'Partner', 'Tenant'],
      required: true
    }),
    new Field('starred', {
      label: 'Preferred',
      defaultValue: false,
      type: 'boolean',
    }),
    new MultiField('avatar', [
      new Field('type', {
        label: "Avatar Type",
        defaultValue: avatarTypes.color,
        domainValues: _.values(avatarTypes),
      }),
      new Field('url', {
        label: "URL",
        type: 'text',
        valueChecker: { checker: avatartarUrlValueChecker, throttle: 200, error: 'Wrong URL!'},
      }),
      new Field('src', {
        label: "File",
      }),
      new Field('color', {
        label: "Preferred Color",
        domainValues: colors,
        defaultValue: rndColor(),
      }),
    ]),
    new Field('website', {
      label: "Website",
      type: "text",
    }),
    new MultiField('address', [
      new Field('street', {
        label: "Street",
        type: "text",
      }),
      new Field('zipcode', {
        label: "Zip Code",
        type: "text",
      }),
      new Field('city', {
        label: "City",
        type: "text",
      }),
      new Field('country', {
        label: "Country",
        type: "text",
      }),
    ]),
    new Field('note', {
      label: "Note",
      type: "text",
    }),
  ], document);
}
