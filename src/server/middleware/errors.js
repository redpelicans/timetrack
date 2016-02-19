import {NotFoundError} from '../helpers';

// to be called at the end of the middleware chain
// to raise errors
export default function errors(err, req, res, next) {
  if (!err) return next();
  if(err instanceof NotFoundError){
    res.sendStatus(404).json({message: "Page not Found"});
  }else{
    var message = err.message || err.toString();
    console.log(err.stack);
    res.status(500).json({message: message});
  }
}