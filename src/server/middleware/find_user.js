import {Person} from '../models';

export default function findUser(secretKey){
  return function(req, res, next) {
    //const token = req.headers['x-token-access'];
    const cookie = req.cookies.timetrackToken;
    //console.log(req.cookies)
    if(!cookie) return res.status(401).json({message: "Unauthorized access"});
    const sessionId = req.headers['x-sessionid'];
    req.sessionId = sessionId;
    Person.getFromToken(cookie, secretKey, (err, user) => {
      if(err){
        console.log(err);
        return res.status(401).json({message: "Unauthorized access"});
      }
      if(!user) return res.status(401).json({message: "Unknown user"});
      if(!user.hasSomeRoles(['admin', 'access']))  return res.status(401).json({message: "Unauthorized access"});
      req.user = user;
      //console.log(`==> user: ${user.email}`);
      next();
    });
  }
}
