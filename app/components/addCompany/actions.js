import alt from '../../alt';
import { createActions } from 'alt/utils/decorators';

@createActions(alt)
export default class AddCompanyActions {
  constructor(){
    this.generateActions(
      'fieldChanged',
      'postData',
      'resetData',
    );
  }
}

