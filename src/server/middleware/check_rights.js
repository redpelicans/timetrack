import _ from 'lodash';
import rights from '../rights';


export default function checkRights(event) {
  const requestedRoles = rights[event] && rights[event].roles || [];
  return function(req, res, next) {
    var user = req.user;
    if (!user){ return res.sendStatus(401).json({message: "Unknown User"}) }
    if (!user.hasAllRoles(requestedRoles)) return res.sendStatus(403).json({message: "Unauthorized User"});
    next();
  }
}

