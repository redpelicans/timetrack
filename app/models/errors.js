import Bacon from 'baconjs';
import Dispatcher from '../utils/dispatcher';
import Immutable from 'immutable';


const errors = new Bacon.Bus();

const model = {
  state: errors,
  alert(err){
    errors.push(err);
  }
}

export default model;
