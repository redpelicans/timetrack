import alt from '../../alt';
import {datasource, createStore} from 'alt/utils/decorators';
import TimesheetActions from './actions';
import moment from 'moment';

@createStore(alt)
export default class TimesheetStore {
  constructor() {
    this.currentDate = moment();
    this.bindActions(TimesheetActions);
  }

  navigateToPreviousWeek() {
    console.info('navigate to previous week');
    this.currentDate.subtract(1, 'w');
  }

  navigateToNextWeek() {
    console.info('navigate to next week');
    this.currentDate.add(1, 'w');
  }
}
