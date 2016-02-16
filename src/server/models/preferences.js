import mongobless, {ObjectId} from 'mongobless';
import _ from 'lodash';

@mongobless({collection: 'preferences'})
export default class Preference {

  static spread(type, user, entities, cb){
    Preference.findAll({personId: user._id, type}, (err, preferences) => {
      if(err) return cb(err);
      const hpreferences = _.reduce(preferences, (res, p) => {res[p.entityId] = true; return res}, {});
      _.each(entities, entity => {
         entity.preferred = !!hpreferences[entity._id];
      });
      cb(null, entities);
    });
  }

  static update(type, user, isPreferred, entity, cb){
    if(isPreferred){
      Preference.collection.update(
        {personId: user._id, entityId: entity._id}, 
        {personId: user._id, entityId: entity._id, type}, 
        {upsert: true},
        err => cb(err, entity) 
      );
    }else{
      Preference.collection.deleteMany(
        {personId: user._id, entityId: entity._id}, 
        err => cb(err, entity) 
      );
    }
  }

  static delete(user, id, cb){
    Preference.collection.deleteMany( {personId: user._id, entityId: id}, err => cb(err, id)) 
  }
};
