import {Formo, Field, MultiField} from 'formo';
import _ from 'lodash';
import {colors, rndColor, avatarTypes, avatartarUrlValueChecker} from './helpers';

export {colors, avatarTypes};

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
    new Field('preferred', {
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
