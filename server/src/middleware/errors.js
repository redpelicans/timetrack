import {NotFoundError, TransacError} from '../helpers';

// to be called at the end of the middleware chain
// to raise errors
export default function errors(err, req, res, next) {
  if (!err) return next();
  if(err instanceof NotFoundError){
    res.sendStatus(404);
  }else if (err instanceof TransacError){
    var message = err.message || err.toString();
    res.status(418).json({message: message, code: err.code});
  }else{
    var message = err.message || err.toString();
    console.log(err.stack);
    res.status(500).json({message: message});
  }
}
