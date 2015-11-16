import {Formo, Field, MultiField} from 'formo';
import _ from 'lodash';
import {colors, rndColor, avatarTypes, avatartarUrlValueChecker} from './helpers';

export {colors, avatarTypes};

export default function person(document){
  return new Formo([
    new Field('prefix', {
      label: "Prefix",
      type: "text",
      required: true,
      defaultValue: 'Mr',
      domainValue: ['Mr', 'Mrs'],
    }),
    new Field('firstName', {
      label: "First Name",
      type: "text",
      required: true,
    }),
    new Field('lastName', {
      label: "Last Name",
      type: "text",
      required: true,
    }),
    new Field('companyId', {
      label: 'Company',
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
    new Field('note', {
      label: "Note",
      type: "text",
    }),
  ], document);
}
