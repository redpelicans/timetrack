import alt from '../../alt';
import {createActions} from 'alt/utils/decorators';

@createActions(alt)
export default class WorkblockActions {
  constructor() {
    this.generateActions(
      'fetch',
      'fetching',
      'fetched',
      'fetchFailed'
    );
  }
}
