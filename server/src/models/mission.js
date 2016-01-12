import mongobless from 'mongobless';

@mongobless({collection: 'missions'})
export default class Mission {
  static loadOne(id, cb){
    Mission.findOne({isDeleted: {$ne: true}, _id: id}, (err, mission) => {
      if(err) return cb(err);
      cb(null, mission);
    });
  }
}
