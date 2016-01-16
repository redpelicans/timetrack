import {Note} from '../models';
import _ from 'lodash';

// TODO: not very efficiant, emit delete event even for already deleted notes
function entityDelete(event, registrations, emitter, entity, params){
  Note.findAll({isDeleted: true, entityId: entity._id}, (err, notes) => {
    if(err) console.error(err);
    _.each(notes, note => emitter('note.delete', note, registrations, params));
  });
}

const conf = {
  'note.view': { roles: [] },
  'note.update': { roles: ['admin'] },
  'note.new': { roles: ['admin'] },
  'note.delete': { roles: ['admin'] },
  'notes.entity.delete': { 
    roles: ['admin'],
    callback: entityDelete,
  },
}

export default conf;

