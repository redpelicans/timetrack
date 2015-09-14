// run as: "babel-node --stage 0 load-missions.js"

import mongobless from 'mongobless';
import {Company, Mission} from '../server/src/models';
import faker from 'faker';
import _ from 'lodash';
import params from '../params';
import async from 'async';

faker.locale = 'en';
require('better-log').install();

mongobless.connect(params.db, (err) => {
  if (err) throw err;
  async.waterfall([getCompanyIds, insertMissions], (err, missions) => {
    mongobless.close();
    if (err) throw err;
    console.log(missions);
    console.log(`Missions successfully loaded in database ${params.db.database}`);
  });
});

function getCompanyIds(cb) {
  Company.findAll({}, {_id: true}, cb);
}

function insertMissions(companyIds, cb) {
  let missions = generateMissions(companyIds);
  Mission.collection.insertMany(missions, (err) => cb(err, missions));
}

function generateMissions(companyIds) {
  return _.times(10, (n) => {
    return {
      label: faker.company.catchPhraseNoun(),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      companyId: companyIds[_.random(0, companyIds.length-1)]._id,
    }
  });
}
