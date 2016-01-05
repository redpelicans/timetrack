import _ from 'lodash';
import async from 'async';
import mongobless, {ObjectId} from 'mongobless';
import njwt from 'njwt';

@mongobless({collection: 'people'})
export default class Person {
  static loadOne(id, cb){
    Person.findOne({isDeleted: {$ne: true}, _id: id}, (err, user) => {
      if(err) return cb(err);
      cb(null, user);
    });
  }

  static getFromToken(token, secretKey, cb){
    njwt.verify(token, secretKey , (err, token) =>{
      if(err){
        console.log(err);
        if(err) return cb(err);
        return res.status(401).json({message: "Wrong Token"});
      }

      Person.loadOne(ObjectId(token.body.sub), (err, user) => {
        if(err) return cb(err);
        cb(null, user);
      });

    });
  }

  hasAllRoles(roles){
    return _.chain(roles).difference(this.roles || []).isEmpty().value();
  }

  fullName(){
    return [this.firstName, this.lastName].join(' ');
  }
};
