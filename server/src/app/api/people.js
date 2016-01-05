import async from 'async';
import moment from 'moment';
import _ from 'lodash';
import {Person} from '../../models';
import {ObjectId} from '../../helpers';
import checkUser  from '../../middleware/check_user';
import checkRights  from '../../middleware/check_rights';
import uppercamelcase  from 'uppercamelcase';

export function init(app, resources){
  app.get('/people', function(req, res, next){
    async.waterfall([loadAll], (err, people) => {
      if(err)return next(err);
      res.json(_.map(people, p => Maker(p)));
    });
  });

  app.post('/people/preferred', checkRights('person.update'), function(req, res, next){
    let id = ObjectId(req.body.id); 
    async.waterfall([loadOne.bind(null, id), preferred.bind(null, Boolean(req.body.preferred))], (err, previous, person) => {
      if(err)return next(err);
      const current = Maker(person);
      res.json(Maker(current));
      resources.reactor.emit('person.update', {previous, current}, {sessionId: req.sessionId});
    });
  });

  app.delete('/person/:id', checkRights('person.delete'), function(req, res, next){
    let id = ObjectId(req.params.id); 
    async.waterfall([del.bind(null, id), findOne], (err, person) => {
      if(err)return next(err);
      res.json({_id: id, isDeleted: true});
      resources.reactor.emit('person.delete', Maker(person), {sessionId: req.sessionId});
    });
  })

  app.post('/people', checkRights('person.new'), function(req, res, next){
    let person = req.body.person;
    async.waterfall([create.bind(null, person), loadOne], (err, person) => {
      if(err)return next(err);
      const p = Maker(person);
      res.json(p);
      resources.reactor.emit('person.new', p, {sessionId: req.sessionId});
    });
  });

  app.put('/person', checkRights('person.update'), function(req, res, next){
    let newPerson = req.body.person;
    let id = ObjectId(newPerson._id);
    async.waterfall([
      loadOne.bind(null, id), 
      update.bind(null, newPerson), 
      (previous, cb) => loadOne(previous._id, (err, person) => cb(err, previous, person)) 
    ], (err, previous, person) => {
      if(err) return next(err);
      const current = Maker(person);
      res.json(current);
      resources.reactor.emit('person.update', {previous, current}, {sessionId: req.sessionId});
    });
  });

  app.post('/person/check_email_uniqueness', checkUser('admin'), function(req, res, next){
    let email = req.body.email && req.body.email.trim();
    Person.findAll({email: email}, {_id: 1}, (err, data) => {
      if(err)return next(err);
      if(data.length) return res.json({email: email, ok: false});
      res.json({email: email, ok: true});
    });
  });

}

function loadAll(cb){
  Person.findAll({isDeleted: {$ne: true}}, cb);
}

function findOne(id, cb){
  Person.findOne({_id: id}, (err, person) => {
    if(err)return next(err);
    if(!person)return cb(new Error(`Unknown person: '${id}'`));
    cb(null, person);
  });
}

function loadOne(id, cb){
  Person.loadOne(id, (err, person) => {
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
    return cb(err, previousPerson)
  })
}


function del(id, cb){
  Person.collection.updateOne({_id: id}, {$set: {isDeleted: true}}, (err) => {
    return cb(err, id)
  })
}


function preferred(isPreferred, person, cb){
  person.preferred = isPreferred;
  Person.collection.update({_id: person._id}, {$set: {preferred: person.preferred}}, err => {
    // TODO: exec loadOne to retreive new updated person instead of updating previous one.
    cb(err, person, person);
  });
}

function fromJson(json){
  let attrs = ['prefix', 'firstName', 'lastName', 'type', 'jobType', 'preferred', 'jobDescription', 'department', 'roles', 'email', 'birthdate', 'note'];
  let res = _.pick(json, attrs);
  res.companyId = json.companyId ? ObjectId(json.companyId) : undefined;
  if(json.skills){
    res.skills = _.chain(json.skills).compact().map( skill => uppercamelcase(skill) ).sort().value();
  }
  if(json.phones){
    let attrs = ['label', 'number'];
    res.phones = _.chain(json.phones).filter(p => p.number).map(p => _.pick(p, attrs)).value();
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
