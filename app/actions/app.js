import alt from '../alt';
import { createActions } from 'alt/utils/decorators';

@createActions(alt)
export default class AppActions {
  constructor(){
    this.generateActions(
        'serverError'
    );
  }
}

