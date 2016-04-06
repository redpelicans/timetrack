import _ from 'lodash';
import async from 'async';
import mongobless, {ObjectId} from 'mongobless';

@mongobless({collection: 'events'})
export default class Event { 
  static loadOne(id, cb){
    Event.findOne({isDeleted: {$ne: true}, _id: id}, (err, event) => {
      if(err) return cb(err);
      cb(null, event);
    });
  }
}

