import alt from '../../alt';
import {datasource, createStore} from 'alt/utils/decorators';
import MissionActions from './actions';
import MissionDatasource from './datasource';
import moment from 'moment';

@createStore(alt)
@datasource(MissionDatasource)
export default class MissionStore {
  constructor() {
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
    console.error('failed to fetch missions', error);
    this.isFetching = false;
  }
}
