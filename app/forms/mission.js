import {Formo, Field, FieldGroup} from 'formo';
import _ from 'lodash';

export default function company(document){
  return new Formo([
    new Field('clientId', {
      label: 'Client',
      checkDomainValue: false,
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
  ], document);
}
