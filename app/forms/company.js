import {Formo, Field, FieldGroup} from 'formo';
import _ from 'lodash';
import {colors, rndColor, avatarTypes} from './helpers';

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
    new FieldGroup('avatar', [
      new Field('type', {
        label: "Avatar Type",
        defaultValue: 'color',
        domainValue: avatarTypes,
      }),
      new Field('url', {
        label: "URL",
        valueChecker: { checker: undefined, debounce: 200},
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
    new FieldGroup('address', [
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
    new Field('tags', {
      label: "Tags",
      type: "text",
      checkDomainValue: false,
      multiValue: true,
    }),
    new Field('note', {
      label: "Note",
      type: "text",
    }),
  ], document);
}
