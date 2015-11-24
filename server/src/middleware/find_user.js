import njwt from 'njwt';
import {Person} from '../models';
import {ObjectId} from '../helpers';

export default function findUser(secretKey){
  return function(req, res, next) {
    const cookie = req.cookies.access_token;
    if(!cookie) return next();
    njwt.verify(cookie, secretKey , (err, token) =>{
      if(err){
        console.log(err);
        return res.sendStatus(401);
      }
      Person.findOne({isDeleted: {$ne: true}, _id: ObjectId(token.sub)}, (err, user) => {
        if(err || !user)return next();
        req.user = user;
        console.log(`user: ${user.email}`);
        next();
      });
    });
  }
}
