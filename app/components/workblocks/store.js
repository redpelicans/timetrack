import alt from '../../alt';
import {datasource, createStore} from 'alt/utils/decorators';
import WorkblockActions from './actions';
import WorkblockDatasource from './datasource';
import MissionStore from '../missions/store';
import moment from 'moment';

@createStore(alt)
@datasource(WorkblockDatasource)
export default class WorkblockStore {
  constructor() {
    this.isFetching = false;
    this.workblocks = [];
    this.bindActions(WorkblockActions);
  }

  fetch() {
    console.info('fetch workblocks');
    if (!this.getInstance().isLoading()) this.getInstance().fetch();
  }

  fetching() {
    console.info('fetching workblocks');
    this.isFetching = true;
  }

  fetched(workblocks) {
    console.info('workblocks fetched');
    // this.waitFor(MissionStore);
    console.log(MissionStore.state.missions)
    this.workblocks = workblocks;
    this.isFetching = false;
  }

  fetchFailed(error) {
    console.error('failed to fetch workblocks', error);
    this.isFetching = false;
  }
}
