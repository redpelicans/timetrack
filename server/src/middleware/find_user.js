import njwt from 'njwt';
import {Person} from '../models';
import {ObjectId} from '../helpers';

export default function findUser(secretKey){
  return function(req, res, next) {
    const cookie = req.headers['x-token-access'];
    if(!cookie) return res.sendStatus(401).json({message: "Unauthorized access"});
    njwt.verify(cookie, secretKey , (err, token) =>{
      if(err){
        console.log(err);
        return res.sendStatus(401).json({message: "Wrong Token"});
      }
      Person.findOne({isDeleted: {$ne: true}, _id: ObjectId(token.body.sub)}, (err, user) => {
        if(err) return res.sendStatus(500).json({message: err.toString()});
        if(!user) return res.sendStatus(401).json({message: "Unknown user"});
        req.user = user;
        //console.log(`==> user: ${user.email}`);
        next();
      });
    });
  }
}
