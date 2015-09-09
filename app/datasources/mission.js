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
                {id: 1, description: 'Research', unit: 'day', quantity: 1, status: 'live', missionId: 1, startTime: '2015-09-09T08:00:00.000Z'},
                {id: 2, description: 'Dev', unit: 'day', quantity: 1, status: 'live', missionId: 1, startTime: '2015-09-11T08:00:00.000Z'}
              ]
            },
            { id: 2,
              label: 'Dev API node.js',
              startDate: '2015-09-07T08:00:00.000Z',
              endDate: '2015-09-11T18:00:00.000Z',
              company: {id: 1, label: 'RedPelicans'},
              workBlocks: [
                {id: 3, description: 'Research', unit: 'day', quantity: 1, status: 'live', missionId: 2, startTime: '2015-09-07T08:00:00.000Z'},
                {id: 4, description: 'Dev', unit: 'day', quantity: 1, status: 'live', missionId: 2, startTime: '2015-09-08T08:00:00.000Z'},
                {id: 5, description: 'Dev', unit: 'day', quantity: 1, status: 'live', missionId: 2, startTime: '2015-09-09T08:00:00.000Z'}
              ]
            }
          ]);
        }, 2000);
      });
    },
    loading: MissionActions.fetching.defer(),
    success: MissionActions.fetched,
    error: MissionActions.fetchFailed
  }
};

export default MissionDataSource;
