import mongobless from 'mongobless';

@mongobless({collection: 'missions'})
export default class Mission {
  // @atttributes:
  //   _id {ObjectId}
  //   label {String}
  //   startDate {Date}
  //   endDate {Date}
  //   companyId {ObjectId}
}
