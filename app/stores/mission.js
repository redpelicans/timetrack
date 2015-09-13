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
    this.isUpdatingMissionWorkBlock = false;
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
    console.error('failed to fetch missions', error);
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

  updateMissionWorkBlock(workblock) {
    console.info('update mission workblock');
    this.getInstance().updateMissionWorkBlock(workblock);
  }

  updatingMissionWorkBlock() {
    console.info('updating missions');
    this.isUpdatingMissionWorkBlock = true;
  }

  updatedMissionWorkBlock(workBlock) {
    console.info('mission updated');
    let mission = _.find(this.missions, 'id', workBlock.missionId);
    let existingWorkBlock = _.find(mission.workBlocks, 'id', workBlock.id);
    if (existingWorkBlock) {
      _.assign(existingWorkBlock, workBlock);
    } else {
      mission.workBlocks.push(workBlock);
    }
    this.isUpdatingMissionWorkBlock = false;
  }

  updateMissionWorkBlockFailed(error) {
    console.error('failed to update mission', error);
    this.isUpdatingMissionWorkBlock = false;
    // feedback to component
  }
}
