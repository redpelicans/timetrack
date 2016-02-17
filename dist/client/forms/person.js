'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = person;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _formo = require('formo');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('./helpers');

exports.colors = _helpers.colors;
exports.avatarTypes = _helpers.avatarTypes;

var types = [{ key: 'contact', value: 'Contact' }, { key: 'consultant', value: 'Consultant' }, { key: 'worker', value: 'Worker' }];

var roles = [{ key: 'admin', value: 'Admin' }, { key: 'access', value: 'Access' }];

var phoneLabels = [{ key: 'mobile', value: 'Mobile' }, { key: 'home', value: 'Home' }, { key: 'work', value: 'Work' }];

var jobType = [{ key: 'designer', value: 'Designer' }, { key: 'developer', value: 'Developer' }, { key: 'manager', value: 'Manager' }, { key: 'sales', value: 'Sales' }, { key: 'businessManager', value: 'Business Manager' }];

function person(document) {
  return new _formo.Formo([new _formo.Field('type', {
    label: "Type",
    type: "text",
    domainValue: types,
    defaultValue: 'contact'
  }), new _formo.Field('prefix', {
    label: "Prefix",
    type: "text",
    required: true,
    defaultValue: 'Mr',
    domainValue: ['Mr', 'Mrs']
  }), new _formo.Field('firstName', {
    label: "First Name",
    type: "text",
    required: true
  }), new _formo.Field('lastName', {
    label: "Last Name",
    type: "text",
    required: true
  }), new _formo.Field('companyId', {
    label: 'Company'
  }), new _formo.Field('preferred', {
    label: 'Preferred',
    defaultValue: false,
    type: 'boolean'
  }), new _formo.FieldGroup('avatar', [new _formo.Field('type', {
    label: "Avatar Type",
    defaultValue: 'color',
    domainValue: _helpers.avatarTypes
  }), new _formo.Field('url', {
    label: "URL",
    valueChecker: { checker: _helpers.avatartarUrlValueChecker, debounce: 200 }
  }), new _formo.Field('src', {
    label: "File"
  }), new _formo.Field('color', {
    label: "Preferred Color",
    domainValue: _helpers.colors,
    defaultValue: (0, _helpers.rndColor)()
  })]), new _formo.Field('email', {
    label: "Email",
    type: "text",
    valueChecker: { checker: _helpers.emailUniqueness, debounce: 200 },
    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  }), new _formo.Field('department', {
    label: "Department",
    type: "text"
  }), new _formo.Field('jobType', {
    label: "Job Type",
    type: "text",
    domainValue: jobType
  }), new _formo.Field('skills', {
    label: "Skills",
    type: "text",
    checkDomainValue: false,
    multiValue: true
  }), new _formo.Field('tags', {
    label: "Tags",
    type: "text",
    checkDomainValue: false,
    multiValue: true
  }), new _formo.Field('roles', {
    label: "Roles",
    type: "text",
    multiValue: true,
    domainValue: roles
  }), new _formo.Field('jobTitle', {
    label: "Job Title",
    type: "text"
  }), new _formo.Field('jobDescription', {
    label: "Job Description",
    type: "text"
  }), new _formo.Field('note', {
    label: "Note",
    type: "text"
  }), new _formo.MultiField('phones', [new _formo.Field('label', {
    label: 'Label',
    type: 'text',
    domainValue: phoneLabels
  }), new _formo.Field('number', {
    label: 'Number',
    type: 'text'
  })])], document);
}
//# sourceMappingURL=person.js.map
