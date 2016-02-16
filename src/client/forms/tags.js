import {Formo, Field, FieldGroup, MultiField} from 'formo';

export default function tags(document){
  return new Formo([
    new Field('tags', {
      label: "Tags",
      type: "text",
      defaultValue: [],
      checkDomainValue: false,
      multiValue: true,
    }),
  ], document);
}
