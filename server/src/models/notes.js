import mongobless, {ObjectId} from 'mongobless';
import _ from 'lodash';

@mongobless({collection: 'notes'})
export default class Note {
  static loadOne(id, cb){
    Note.findOne({isDeleted: {$ne: true}, _id: id}, (err, note) => {
      if(err) return cb(err);
      cb(null, note);
    });
  }

  static create(content, user, entity, cb){
    if(!content)return setImmediate(cb, null, entity);
    const note = {
      entityId: entity._id,
      createdAt: new Date(),
      authorId: user._id,
      content: content,
    };
    Note.collection.insertOne(note, err => cb(err, entity));
  }

  static delete(id, cb){
    Note.collection.deleteMany( {entityId: id}, err => cb(err, id)) 
  }
};
