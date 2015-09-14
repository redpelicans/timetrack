import mongobless from 'mongobless';

@mongobless({collection: 'workblocks'})
export default class Workblock {
  // @atttributes:
  //   _id {ObjectId}
  //   description {String}
  //   unit {String}
  //   quantity {Float}
  //   status {String}
  //   startTime {Datetime}
  //   missionId {ObjectId}
}
