import {Formo, Field, MultiField} from 'formo';
import _ from 'lodash';
import {checkStatus, parseJSON} from '../utils';

export const colors = [ '#d73d32', '#7e3794', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080' ];

export const avatarTypes = [
  {key: 'color', value: 'Color Picker'}, 
  {key: 'url', value: 'Logo URL'}, 
  {key: 'src', value: 'Logo File'}
];

function rndColor() {
  let index = Math.floor(Math.random() * colors.length);
  return colors[ index ];
}

function avatartarUrlValueChecker(url, state){
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

export default function company(document){
  return new Formo([
    new Field('name', {
      label: "Name",
      type: "text",
      required: true
    }),
    new Field('type', {
      label: "Type",
      defaultValue: 'client',
      domainValue: [
        {key: 'client', value: 'Client'}, 
        {key: 'partner', value: 'Partner'}, 
        {key: 'tenant', value: 'Tenant'}, 
      ],
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
        defaultValue: 'color',
        domainValue: avatarTypes,
      }),
      new Field('url', {
        label: "URL",
        valueChecker: { checker: avatartarUrlValueChecker, debounce: 200},
      }),
      new Field('src', {
        label: "File",
      }),
      new Field('color', {
        label: "Preferred Color",
        domainValue: colors,
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
