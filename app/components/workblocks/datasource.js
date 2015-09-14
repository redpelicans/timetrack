import WorkblockActions from './actions';
import {requestJson} from '../../utils';

const WorkblockDatasource = {
  fetch: {
    remote(state) {
      return requestJson('/api/workblocks');
    },
    loading: WorkblockActions.fetching.defer(),
    success: WorkblockActions.fetched,
    error: WorkblockActions.fetchFailed
  },
};

export default WorkblockDatasource;
