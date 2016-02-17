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
    if(!content)return setImmediate(cb, null, entity, null);
    const note = {
      entityId: entity._id,
      createdAt: new Date(),
      authorId: user._id,
      content: content,
    };
    Note.collection.insertOne(note, err => cb(err, entity, note));
  }

  static deleteForOneEntity(id, cb){
    Note.collection.updateMany({entityId: id}, {$set: {updatedAt: new Date(), isDeleted: true}}, err => cb(err, id))
  }
};
