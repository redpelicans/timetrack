import alt from '../../alt';
import {createActions} from 'alt/utils/decorators';

@createActions(alt)
export default class TimesheetActions {
  constructor() {
    this.generateActions(
      'navigateToPreviousWeek',
      'navigateToNextWeek'
    );
  }
}
