import njwt from 'njwt';
import {Person} from '../models';
import {ObjectId} from '../helpers';

export default function findUser(secretKey){
  return function(req, res, next) {
    const cookie = req.headers['x-token-access'];
    if(!cookie) return res.sendStatus(401);
    njwt.verify(cookie, secretKey , (err, token) =>{
      if(err){
        console.log(err);
        return res.sendStatus(401);
      }
      Person.findOne({isDeleted: {$ne: true}, _id: ObjectId(token.body.sub)}, (err, user) => {
        if(err) return res.sendStatus(500);
        if(!user) return res.sendStatus(401);
        req.user = user;
        console.log(`==> user: ${user.email}`);
        next();
      });
    });
  }
}
