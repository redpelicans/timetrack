
import moment  from 'moment';

class NotFoundError extends Error{
} 

class TransacError extends Error{
  constructor(message, code){
    super(message);
    this.code = code;
  }
} 

const FMT = 'DD/MM/YYYY'
function dmy(date){
  return moment(date).format(FMT);
}

dmy.FMT= FMT;

export {TransacError, NotFoundError, dmy, FMT};
