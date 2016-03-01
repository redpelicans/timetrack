// run as: "babel-node --stage 0 loadClients.js"

import mongobless, {ObjectId} from 'mongobless';
import {Company, Person, Mission, Note} from '../../src/server/models';
import async from 'async';
import _ from 'lodash';
import params from '../../params';


mongobless.connect(params.db, (err) => {
  if(err) throw err;
  async.parallel({ notes, company, mission, person }, (err, data) => {
    if(err){
      mongobless.close();
      throw err;
    }
    updateNotes(data, (err) => {
      console.log("Done.");
      mongobless.close();
    });
  });
});

function updateNotes({notes, ...types}, cb){
  async.map(notes, updateNote.bind(null, types), cb);
}

function updateNote(types, note, cb){
  const type = _.reduce(_.toPairs(types), (type, [name, h]) => h[note.entityId] && name || type, null )
  Note.collection.update({_id: note._id}, {$set: {entityType: type}}, cb);
}

function notes(cb){
  Note.findAll({}, cb);
}

function company(cb){
  Company.findAll({}, (err, companies) => cb(err, _.reduce(companies, (res, x) => { res[x._id] = x; return res}, {})));
}

function person(cb){
  Person.findAll({}, (err, people) => cb(err, _.reduce(people, (res, x) => { res[x._id] = x; return res}, {})));
}

function mission(cb){
  Mission.findAll({}, (err, missions) => cb(err, _.reduce(missions, (res, x) => { res[x._id] = x; return res}, {})));
}

