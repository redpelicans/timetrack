
import moment  from 'moment';
import mongobless, {ObjectId}  from 'mongobless';

class NotFoundError extends Error{
} 

const FMT = 'DD/MM/YYYY'
function dmy(date){
  return moment(date).format(FMT);
}

dmy.FMT= FMT;

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {NotFoundError, dmy, FMT, getRandomInt, ObjectId};
