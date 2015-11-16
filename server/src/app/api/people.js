import async from 'async';
import moment from 'moment';
import _ from 'lodash';
import {Person} from '../../models';
import {ObjectId} from '../../helpers';

export function init(app){
  app.get('/people', function(req, res, next){
    async.waterfall([loadAll], (err, people) => {
      if(err)return next(err);
      res.json(_.map(people, p => PersonMaker(p)));
    });
  });

  app.post('/people/preferred', function(req, res, next){
    let id = ObjectId(req.body.id); 
    async.waterfall([loadPerson.bind(null, id), preferred.bind(null, Boolean(req.body.preferred))], (err, person) => {
      if(err)return next(err);
      res.json(PersonMaker(person));
    });
  });
}

function loadAll(cb){
  Person.findAll({isDeleted: {$ne: true}}, cb);
}

function loadPerson(id, cb){
  let query = {
    _id: id,
    isDeleted: {$ne: true},
  };
  Person.findOne(query, (err, person) => {
    if(err)return next(err);
    if(!person)return cb(new Error(`Unknown person: '${id}'`));
    cb(null, person);
  });
}

function preferred(isPreferred, person, cb){
  person.preferred = isPreferred;
  Person.collection.update({_id: person._id}, {$set: {preferred: person.preferred}}, err => {
    cb(err, person);
  });
}

function PersonMaker(person){
  person.name = [person.firstName, person.lastName].join(' ');
  person.isNew = moment.duration(moment() - person.createdAt).asDays() < 1;
  return person;
}
