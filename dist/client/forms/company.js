'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = company;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _formo = require('formo');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _helpers = require('./helpers');

exports.colors = _helpers.colors;
exports.avatarTypes = _helpers.avatarTypes;

function company(document) {
  return new _formo.Formo([new _formo.Field('name', {
    label: "Name",
    type: "text",
    required: true
  }), new _formo.Field('type', {
    label: "Type",
    defaultValue: 'client',
    domainValue: [{ key: 'client', value: 'Client' }, { key: 'partner', value: 'Partner' }, { key: 'tenant', value: 'Tenant' }],
    required: true
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
  })]), new _formo.Field('website', {
    label: "Website",
    type: "text"
  }), new _formo.FieldGroup('address', [new _formo.Field('street', {
    label: "Street",
    type: "text"
  }), new _formo.Field('zipcode', {
    label: "Zip Code",
    type: "text"
  }), new _formo.Field('city', {
    label: "City",
    type: "text"
  }), new _formo.Field('country', {
    label: "Country",
    type: "text"
  })]), new _formo.Field('tags', {
    label: "Tags",
    type: "text",
    checkDomainValue: false,
    multiValue: true
  }), new _formo.Field('note', {
    label: "Note",
    type: "text"
  })], document);
}
//# sourceMappingURL=company.js.map
