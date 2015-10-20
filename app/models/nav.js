import Bacon from 'baconjs';
import Dispatcher from '../utils/dispatcher';


const d = new Dispatcher();


const property = Bacon.update(
    {currentTopic: undefined}
  , [d.stream('newTopic')], newTopic
);

function newTopic(state, topic){
  return {currentTopic: topic};
}


const Nav = {
  get property(){
    return property;
  },
  newTopic(topic){
    d.push('newTopic', topic);
  }
}

export default Nav;

