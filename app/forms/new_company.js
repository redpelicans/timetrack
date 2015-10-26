import {Formo, Field, MultiField} from '../utils/formo';

let form = new Formo([
  new Field('name', {
    label: "Name",
    type: "text",
    required: true
  }),
  new Field('type', {
    label: "Type",
    defaultValue: 'Client',
    domainValues: ['Client', 'Partner', 'Tenant'],
    required: true
  }),
  new Field('logoUrl', {
    label: "Logo URL",
    type: 'url',
  }),
  new Field('color', {
    label: "Preferred Color",
    type: 'color',
    required: true
  }),
  new MultiField('price', [
    new Field('amount', {
      label: "Amount",
      type: "number",
      defaultValue: 42,
      required: true
    }),
    new Field('currency', {
      defaultValue: 'EUR',
      domainValues: ['EUR', 'USD'],
    })
  ])
]);

export default form;
