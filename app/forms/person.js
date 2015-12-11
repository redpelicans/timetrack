import {Formo, Field, FieldGroup, MultiField} from 'formo';
import _ from 'lodash';
import {colors, rndColor, avatarTypes, avatartarUrlValueChecker, emailUniqueness} from './helpers';

export {colors, avatarTypes};

const types = [
  {key: 'contact', value: 'Contact'},
  {key: 'consultant', value: 'Consultant'},
  {key: 'worker', value: 'Worker'},
];

const roles = [
  {key: 'admin', value: 'Admin'},
  {key: 'worker', value: 'Worker'},
];

const phoneLabels = [
  {key: 'mobile', value: 'Mobile'},
  {key: 'home', value: 'Home'},
  {key: 'work', value: 'Work'},
];


const jobType = [
  {key: 'designer', value: 'Designer'},
  {key: 'developer', value: 'Developer'},
  {key: 'manager', value: 'Manager'},
  {key: 'sales', value: 'Sales'},
];

export default function person(document){
  return new Formo([
    new Field('type', {
      label: "Type",
      type: "text",
      domainValue: types,
      defaultValue: 'contact',
    }),
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
    new FieldGroup('avatar', [
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
    new Field('email', {
      label: "Email",
      type: "text",
      valueChecker: { checker: emailUniqueness, debounce: 200},
      pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    }),
    new Field('department', {
      label: "Department",
      type: "text",
    }),
    new Field('jobType', {
      label: "Job Type",
      type: "text",
      domainValue: jobType
    }),
    new Field('skills', {
      label: "Skills",
      type: "text",
      checkDomainValue: false,
      multiValue: true,
    }),
    new Field('roles', {
      label: "Roles",
      type: "text",
      multiValue: true,
      domainValue: roles
    }),
    new Field('jobTitle', {
      label: "Job Title",
      type: "text",
    }),
    new Field('jobDescription', {
      label: "Job Description",
      type: "text",
    }),
    new Field('note', {
      label: "Note",
      type: "text",
    }),
    new MultiField('phones', [
      new Field('label', {
        label: 'Label',
        type: 'text',
        domainValue: phoneLabels
      }),
      new Field('number', {
        label: 'Number',
        type: 'text',
      }),
    ]),
  ], document);
}
