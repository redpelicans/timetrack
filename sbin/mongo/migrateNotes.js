// run as: "babel-node --stage 0 loadClients.js"

import mongobless, {ObjectId} from 'mongobless';
import {Company, Person, Mission, Note} from '../../server/src/models';
import async from 'async';
import _ from 'lodash';
import params from '../../params';

const EricId = ObjectId("566abcf0999ed3c65813b32f");

mongobless.connect(params.db, (err) => {
  if(err) throw err;
  async.parallel([
    companies,
    missions,
    people
  ], (err, data) => {
    if(err){
      mongobless.close();
      throw err;
    }
    console.log("Done.");
    mongobless.close();
  });
});

function companies(cb){
  async.waterfall([ loadAllCompanies, updateAll.bind(null, Company)], cb);
}

function loadAllCompanies(cb){
  Company.findAll({}, cb);
}

function people(cb){
  async.waterfall([ loadAllPeople, updateAll.bind(null, Person)], cb);
}

function loadAllPeople(cb){
  Person.findAll({}, cb);
}

function missions(cb){
  async.waterfall([ loadAllMissions, updateAll.bind(null, Mission)], cb);
}

function loadAllMissions(cb){
  Mission.findAll({}, cb);
}

function updateAll(klass, documents, cb){
  async.map(documents, updateOne.bind(null, klass), cb);
}

function updateOne(klass, document, cb){
  if(!document.note)return setImmediate(cb);
  const note = {
    entityId: document._id,
    content: document.note,
    authorId: EricId,
    createdAt: new Date(2016, 1, 1),
  }
  console.log(note)
  Note.collection.insertOne(note, cb);
}
