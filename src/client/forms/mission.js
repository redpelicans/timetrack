import {Formo, Field, FieldGroup} from 'formo'
import _ from 'lodash'

const units = [
  {key: 'day', value: 'Day'},
  {key: 'hour', value: 'Hour'},
]

const allowWeekendsDomain = [
  {key: true, value: 'Allow'},
  {key: false, value: 'Do not Allow'},
]

const billedTarget = [
  {key: 'partner', value: "Partner"},
  {key: 'client', value: "Client"},
]

export default function company(document){
  return new Formo([
    new Field('clientId', {
      label: 'Client',
      checkDomainValue: false,
      required: true
    }),
    new Field('partnerId', {
      label: 'Partner',
      checkDomainValue: false,
    }),
    new Field('billedTarget', {
      label: "Billed Target",
      domainValue: billedTarget,
      defaultValue: 'client',
      required: true
    }),
    new Field('managerId', {
      label: 'Manager',
      checkDomainValue: false,
      required: true
    }),
    new Field('name', {
      label: "Name",
      type: "text",
      required: true
    }),
    new Field('workerIds', {
      label: "Workers",
      type: "text",
      checkDomainValue: false,
      multiValue: true,
    }),
    new Field('description', {
      label: "Description",
      type: "text",
    }),
    new Field('startDate', {
      label: "Start Date",
      defaultValue: new Date(),
    }),
    new Field('endDate', {
      label: "End Date",
    }),
    new Field('note', {
      label: "Note",
      type: "text",
    }),
    new Field('timesheetUnit', {
      label: "Timesheet Unit",
      type: "text",
      defaultValue: 'day',
      domainValue: units,
    }),
    new Field('allowWeekends', {
      label: "Allow Weekends",
      defaultValue: false,
      type: "boolean",
      domainValue: allowWeekendsDomain,
    }),
  ], document);
}
