import alt from '../alt';
import { createActions } from 'alt/utils/decorators';

@createActions(alt)
export default class ClientActions {
  constructor(){
    this.generateActions(
        'fetch'
      , 'loading'
      , 'loaded'
      , 'fetchFailed'
    );
  }
}

