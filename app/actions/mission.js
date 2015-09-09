import alt from '../alt';
import {createActions} from 'alt/utils/decorators';

@createActions(alt)
export default class MissionActions {
  constructor() {
    this.generateActions(
      'fetch',
      'fetching',
      'fetched',
      'fetchFailed',
      'navigateToPreviousWeek',
      'navigateToNextWeek'
    );
  }
}
