import {Formo, Field, FieldGroup} from 'formo'
import _ from 'lodash'

export default function agenda(document){
  return new Formo([
    new Field('workerIds', {
      label: 'Workers',
      checkDomainValue: false,
      multiValue: true,
    }),
    new Field('missionIds', {
      label: 'Missions',
      checkDomainValue: false,
      multiValue: true,
    }),
  ], document);
}
