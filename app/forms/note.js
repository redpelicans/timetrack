import {Formo, Field, FieldGroup, MultiField} from 'formo';

export default function note(document){
  return new Formo([
    new Field('content', {
      type: "text",
    }),
  ], document);
}
