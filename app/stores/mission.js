import alt from '../alt';
import {datasource, createStore} from 'alt/utils/decorators';
import MissionActions from '../actions/mission';
import MissionDataSource from '../datasources/mission';
import moment from 'moment';

@createStore(alt)
@datasource(MissionDataSource)
export default class MissionStore {
  constructor() {
    this.currentDate = moment();
    this.isFetching = false;
    this.missions = [];
    this.bindActions(MissionActions);
  }

  fetch() {
    console.info('fetch missions');
    if (!this.getInstance().isLoading()) this.getInstance().fetch();
  }

  fetching() {
    console.info('fetching missions');
    this.isFetching = true;
  }

  fetched(missions) {
    console.info('missions fetched');
    this.missions = missions;
    this.isFetching = false;
  }

  fetchFailed(error) {
    console.error('failed to fetch missions');
    this.isFetching = false;
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
