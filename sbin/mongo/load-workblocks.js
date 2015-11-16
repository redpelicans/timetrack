// run as: "babel-node --stage 0 load-workblocks.js"

import mongobless from 'mongobless';
import {Mission, Workblock} from '../server/src/models';
import faker from 'faker';
import _ from 'lodash';
import params from '../params';
import async from 'async';

faker.locale = 'en';
require('better-log').install();

mongobless.connect(params.db, (err) => {
  if (err) throw err;
  async.waterfall([getMissions, insertWorkblocks], (err, workblocks) => {
    mongobless.close();
    if (err) throw err;
    console.log(workblocks);
    console.log(`Workblocks successfully loaded in database ${params.db.database}`);
  });
});

function getMissions(cb) {
  Mission.findAll({}, cb);
}

function insertWorkblocks(missions, cb) {
  let workblocks = generateWorkblocks(missions);
  Workblock.collection.insertMany(workblocks, (err) => cb(err, workblocks));
}

function generateWorkblocks(missions) {
  return _.times(100, (n) => {
    let mission = missions[_.random(0, missions.length-1)];
    return {
      description: faker.lorem.sentence(),
      unit: 'day',
      quantity: [0.25, 0.5, 0.75, 1][_.random(0,3)],
      status: 'active',
      startTime: faker.date.between(mission.startDate, mission.endDate),
      missionId: mission._id
    }
  });
}
