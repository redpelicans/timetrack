'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = company;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _formo = require('formo');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var units = [{ key: 'day', value: 'Day' }, { key: 'hour', value: 'Hour' }];

var allowWeekendsDomain = [{ key: true, value: 'Allow' }, { key: false, value: 'Do not Allow' }];

function company(document) {
  return new _formo.Formo([new _formo.Field('clientId', {
    label: 'Client',
    checkDomainValue: false,
    required: true
  }), new _formo.Field('managerId', {
    label: 'Manager',
    checkDomainValue: false,
    required: true
  }), new _formo.Field('name', {
    label: "Name",
    type: "text",
    required: true
  }), new _formo.Field('workerIds', {
    label: "Workers",
    type: "text",
    checkDomainValue: false,
    multiValue: true
  }), new _formo.Field('description', {
    label: "Description",
    type: "text"
  }), new _formo.Field('startDate', {
    label: "Start Date",
    defaultValue: new Date()
  }), new _formo.Field('endDate', {
    label: "End Date"
  }), new _formo.Field('note', {
    label: "Note",
    type: "text"
  }), new _formo.Field('timesheetUnit', {
    label: "Timesheet Unit",
    type: "text",
    defaultValue: 'day',
    domainValue: units
  }), new _formo.Field('allowWeekends', {
    label: "Allow Weekends",
    defaultValue: false,
    type: "boolean",
    domainValue: allowWeekendsDomain
  })], document);
}

module.exports = exports['default'];
//# sourceMappingURL=mission.js.map
