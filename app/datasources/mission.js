import MissionActions from '../actions/mission';

const MissionDataSource = {
  fetch: {
    remote(state) {
      return new Promise((resolve, reject) => {
        setTimeout(function() {
          resolve([
            { id: 1,
              label: 'Dev App. Web React',
              startDate: '2015-09-07T08:00:00.000Z',
              endDate: '2015-09-11T18:00:00.000Z',
              company: {id: 1, label: 'RedPelicans'},
              workBlocks: [
                {id: 1, missionId: 1, description: 'Research', unit: 'day', quantity: 1, status: 'live', startTime: '2015-09-09T08:00:00.000Z'},
                {id: 2, missionId: 1, description: 'Dev', unit: 'day', quantity: 1, status: 'live', startTime: '2015-09-11T08:00:00.000Z'}
              ]
            },
            { id: 2,
              label: 'Dev API node.js',
              startDate: '2015-09-07T08:00:00.000Z',
              endDate: '2015-09-11T18:00:00.000Z',
              company: {id: 1, label: 'RedPelicans'},
              workBlocks: [
                {id: 3, missionId: 2, description: 'Research', unit: 'day', quantity: 1, status: 'live', startTime: '2015-09-07T08:00:00.000Z'},
                {id: 4, missionId: 2, description: 'Dev', unit: 'day', quantity: 1, status: 'live', startTime: '2015-09-08T08:00:00.000Z'},
                {id: 5, missionId: 2, description: undefined, unit: 'day', quantity: 1, status: 'live', startTime: '2015-09-09T08:00:00.000Z'}
              ]
            }
          ]);
        }, 2000);
      });
    },
    loading: MissionActions.fetching.defer(),
    success: MissionActions.fetched,
    error: MissionActions.fetchFailed
  },
  updateMissionWorkBlock: {
    remote(state, workBlock) {
      return new Promise((resolve, reject) => {
        setTimeout(function() {
          resolve({
            id: workBlock.id || 100,
            missionId: workBlock.missionId,
            unit: 'day',
            description: workBlock.description,
            quantity: workBlock.quantity,
            status: 'live',
            startTime: workBlock.startTime
          });
        }, 2000);
      });
    },
    loading: MissionActions.updatingMissionWorkBlock.defer(),
    success: MissionActions.updatedMissionWorkBlock,
    error: MissionActions.updateMissionWorkBlockFailed
  }
};

export default MissionDataSource;
