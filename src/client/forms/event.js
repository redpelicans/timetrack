import {Formo, Field, FieldGroup} from 'formo'
import _ from 'lodash'

const units = [
  {key: 'day', value: 'Day'},
  //{key: 'hour', value: 'Hour'},
]

export const statusDomainValue = [
  {key: 'cancelled', value: 'Cancelled'}, 
  {key: 'locked', value: 'Locked'}, 
  {key: 'toBeValidated', value: 'ToBeValidated'}, 
  {key: 'validated', value: 'Validated'}, 
]

export default function event(document){
  return new Formo([
    new Field('workerId', {
      label: 'Worker',
      checkDomainValue: false,
      required: true
    }),
    new Field('missionId', {
      label: 'Mission',
      checkDomainValue: false,
    }),
    new Field('description', {
      label: "Description",
      type: 'text',
      required: false,
    }),
    new Field('startDate', {
      label: "StartDate",
    }),
    new Field('endDate', {
      label: "EndDate",
    }),
    new Field('type', {
      label: "Type",
      defaultValue: 'work',
      domainValue: [
        {key: 'rtt', value: 'RTT'}, 
        {key: 'vacation', value: 'Vacation'}, 
        {key: 'work', value: 'Work'}, 
      ],
      required: true
    }),
    new Field('status', {
      label: "Status",
      defaultValue: 'toBeValidated',
      domainValue: statusDomainValue,
      required: true
    }),
    new Field('unit', {
      label: "Unit",
      type: "text",
      defaultValue: 'day',
      domainValue: units,
    }),
    new Field('value', {
      label: "Value",
      type: 'number',
    }),
  ], document);
}
