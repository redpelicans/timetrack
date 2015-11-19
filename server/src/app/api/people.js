import async from 'async';
import moment from 'moment';
import _ from 'lodash';
import {Person} from '../../models';
import {ObjectId} from '../../helpers';

export function init(app){
  app.get('/people', function(req, res, next){
    async.waterfall([loadAll], (err, people) => {
      if(err)return next(err);
      res.json(_.map(people, p => Maker(p)));
    });
  });

  app.post('/people/preferred', function(req, res, next){
    let id = ObjectId(req.body.id); 
    async.waterfall([loadOne.bind(null, id), preferred.bind(null, Boolean(req.body.preferred))], (err, person) => {
      if(err)return next(err);
      res.json(Maker(person));
    });
  });

  app.delete('/person/:id', function(req, res, next){
    let id = ObjectId(req.params.id); 
    async.waterfall([del.bind(null, id)], (err) => {
      if(err)return next(err);
      res.json({_id: id, isDeleted: true});
    });
  })

  app.post('/people', function(req, res, next){
    let person = req.body.person;
    async.waterfall([create.bind(null, person), loadOne], (err, person) => {
      if(err)return next(err);
      res.json(Maker(person));
    });
  });

  app.put('/person', function(req, res, next){
    let newPerson = req.body.person;
    let id = ObjectId(newPerson._id);
    async.waterfall([loadOne.bind(null, id), update.bind(null, newPerson), loadOne], (err, person) => {
      if(err)return next(err);
      res.json(Maker(person));
    });
  });

}

function loadAll(cb){
  Person.findAll({isDeleted: {$ne: true}}, cb);
}

function loadOne(id, cb){
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

function create(person, cb){
  let newPerson = fromJson(person) ;
  newPerson.createdAt = new Date();
  Person.collection.insertOne(newPerson, (err, _) => {
    //console.log(newPerson);
    return cb(err, newPerson._id)
  })
}

function update(newPerson, previousPerson, cb){
  let updates = fromJson(newPerson);
  Person.collection.updateOne({_id: previousPerson._id}, {$set: updates}, (err) => {
    //console.log(updates);
    return cb(err, previousPerson._id)
  })
}


function del(id, cb){
  Person.collection.updateOne({_id: id}, {$set: {isDeleted: true}}, (err) => {
    return cb(err)
  })
}


function preferred(isPreferred, person, cb){
  person.preferred = isPreferred;
  Person.collection.update({_id: person._id}, {$set: {preferred: person.preferred}}, err => {
    cb(err, person);
  });
}

function fromJson(json){
  let attrs = ['prefix', 'firstName', 'lastName', 'preferred', 'jobTitle', 'jobArea', 'jobType', 'birthdate', 'note'];
  let res = _.pick(json, attrs);
  res.companyId = json.companyId ? ObjectId(json.companyId) : undefined;
  if(json.phones){
    let attrs = ['label', 'phone'];
    res.phones = _.map(json.phones, p => _.pick(p, attrs));
  }
  if(json.avatar){
    let attrs = ['src', 'url', 'color', 'type'];
    res.avatar = _.pick(json.avatar, attrs);
  }
  res.updatedAt = new Date(); 
  return res;
}

function Maker(person){
  person.name = [person.firstName, person.lastName].join(' ');
  person.isNew = moment.duration(moment() - person.createdAt).asDays() < 1;
  return person;
}
