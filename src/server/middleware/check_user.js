import _ from 'lodash';

export default function checkUser(roles) {
  if (typeof roles == 'string') roles = [roles];
  const requestedRoles = roles;
  return function(req, res, next) {
    var user = req.user;
    if (!user){ return res.status(401).json({message: "Unknown User"}) }
    if (!user.hasAllRoles(requestedRoles)) return res.status(403).json({message: "Unauthorized User"});
    next();
  }
}

// function hasAllRoles(user, roles){
//   return _.chain(roles).difference(user.roles || []).isEmpty().value();
// }
