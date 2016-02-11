import mongobless from 'mongobless';
import async from 'async';
// load models
import {Note, Person, Company} from '../models';

const _ = require('lodash')
    , debug = require('debug')('timetrack:models');

export default function init(params) {
  return function(cb) {
    mongobless.connect(_.extend({verbose: false}, params), (err, db) => {
      if(err){
        console.log(err);
        return cb(err);
      }
      ensureIndexes( err => {
        debug('Timetrack models are ready to help you ...');
        cb(err, db);
      });
    });
  }
}


// TODO: should be transfered to mongobless: one day ....
function ensureIndexes(cb){
  async.parallel([
    person_email,
    person_company_id,
    person_skills,
    company_country,
    company_city,
    company_tags,
    person_tags,
    note_entityId,
  ], cb);
}

function person_email(cb){
  //Person.collection.ensureIndex({email:1}, {unique: true, sparse: true, background: true}, cb);
  Person.collection.ensureIndex({email:1}, {unique: false, background: true}, cb);
}

function person_company_id(cb){
  Person.collection.ensureIndex({company_id:1}, {background: true}, cb);
}

function note_entityId(cb){
  Note.collection.ensureIndex({entityId:1}, {background: true}, cb);
}

function person_skills(cb){
  Person.collection.ensureIndex({skills:1}, {background: true}, cb);
}

function company_city(cb){
  Company.collection.ensureIndex({'address.city': 1}, {background: true}, cb);
}

function company_country(cb){
  Company.collection.ensureIndex({'address.country': 1}, {background: true}, cb);
}


function company_tags(cb){
  Company.collection.ensureIndex({'tags': 1}, {background: true}, cb);
}

function person_tags(cb){
  Person.collection.ensureIndex({'tags': 1}, {background: true}, cb);
}
