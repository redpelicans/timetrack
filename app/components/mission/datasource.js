import MissionActions from './actions';
import {requestJson} from '../../utils';

const MissionDatasource = {
  fetch: {
    remote(state) {
      return requestJson('/api/missions');
    },
    // loading: MissionActions.fetching.defer(),
    success: MissionActions.fetched,
    error: MissionActions.fetchFailed
  },
};

export default MissionDatasource;
