import {Formo, Field, MultiField} from '../utils/formo';
import _ from 'lodash';
import {checkStatus, parseJSON} from '../utils';

export const colors = [ '#d73d32', '#7e3794', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080' ];

function rndColor() {
  let index = Math.floor(Math.random() * colors.length);
  return colors[ index ];
}

function logoUrlValueChecker(url, state){
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

export default function company(){
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
    new Field('logoUrl', {
      label: "Logo URL",
      type: 'text',
      valueChecker: { checker: logoUrlValueChecker, throttle: 200, error: 'Wrong URL!'},
    }),
    new Field('color', {
      label: "Preferred Color",
      domainValues: colors,
      defaultValue: rndColor(),
    }),
    new Field('price', {
      label: "Price",
      type: 'integer',
      defaultValue: 42,
    }),

    // new MultiField('price', [
    //   new Field('amount', {
    //     label: "Amount",
    //     type: "number",
    //     defaultValue: 42,
    //     required: true
    //   }),
    //   new Field('currency', {
    //     defaultValue: 'EUR',
    //     domainValues: ['EUR', 'USD'],
    //   })
    // ])
  ]);
}
