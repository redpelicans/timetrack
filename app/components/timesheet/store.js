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
    this.currentDate.subtract(1, 'w');
  }

  navigateToNextWeek() {
    this.currentDate.add(1, 'w');
  }

  navigateToToday() {
    this.currentDate = moment();
  }
}
