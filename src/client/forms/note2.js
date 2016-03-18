import {Formo, Field, FieldGroup, MultiField} from 'formo';

const statusDomain = [
  {key: true, value: 'Closed'},
  {key: false, value: 'Open'}
]

export default function note(document){
  return new Formo([
    new FieldGroup('entity', [
      new Field('typeName', {
        label: "Entity Type",
        type: 'text',
        defaultValue: 'other',
        domainValue: ['company', 'mission', 'person', 'other'],
      }),
      new Field('_id', {
        label: "Entity",
        checkDomainValue: false,
      }),
    ]),
    new FieldGroup('note', [
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
    ])
  ], document)
}
