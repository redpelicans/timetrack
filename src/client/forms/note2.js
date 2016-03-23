import {Formo, Field, FieldGroup, MultiField} from 'formo';

const statusDomain = [
  {key: true, value: 'Closed'},
  {key: false, value: 'Open'}
]

export default function note(document){
  return new Formo([
    new Field('entityType', {
      label: "Entity Type",
      type: 'text',
      defaultValue: 'person',
      domainValue: [
        {key: undefined, value: '<None>'},
        {key: 'company', value: 'Company'},
        {key: 'mission', value: 'Mission'},
        {key: 'person', value: 'Person'}
      ],
    }),
    new Field('entityId', {
      label: "Entity",
      type: 'text',
      checkDomainValue: false,
    }),
    new Field('dueDate', {
      label: "Due date",
    }),
    new Field('content', {
      label: "Note content",
      type: 'text',
    }),
    new Field('assigneesIds', {
      label: "Assignees",
      type: 'text',
      checkDomainValue: false,
      multiValue: true,
    }),
    new FieldGroup('notification', [
      new Field('delay', {label: "Delay", type: 'number'}),
      new Field('unit', {label: "Unit", defaultValue: 'minute', domainValue: ['minute', 'hour', 'day', 'week', 'month']}),
    ]),
    new Field('status', {
      label: "Status",
      defaultValue: false,
      type: 'boolean',
      domainValue: statusDomain,
    })
  ], document)
}
