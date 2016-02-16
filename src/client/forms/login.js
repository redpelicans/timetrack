import {Formo, Field} from 'formo';

export default function login(){
  return new Formo([
    new Field('userName', {
      label: "User Name",
      type: "text",
      required: true,
    }),
    new Field('password', {
      label: "Password",
      //type: "password",
      type: 'text',
      required: true,
    }),
  ]);
}
