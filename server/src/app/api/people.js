import async from 'async';
import moment from 'moment';
import _ from 'lodash';
import {Person, Preference} from '../../models';
import {ObjectId} from '../../helpers';
import checkUser  from '../../middleware/check_user';
import checkRights  from '../../middleware/check_rights';
import uppercamelcase  from 'uppercamelcase';

export function init(app, resources){
  app.get('/people', function(req, res, next){
    async.waterfall([
      loadAll, 
      Preference.spread.bind(Preference, 'person', req.user)
    ], (err, people) => {
      if(err)return next(err);
      res.json(_.map(people, p => Maker(p)));
    });
  });

  app.post('/people/preferred', checkRights('person.update'), function(req, res, next){
    let id = ObjectId(req.body.id); 
    const isPreferred = Boolean(req.body.preferred);
    async.waterfall([
      loadOne.bind(null, id), 
      Preference.update.bind(Preference, 'person', req.user, isPreferred)
    ], (err, person) => {
      if(err)return next(err);
      const current = Maker(person);
      current.preferred = isPreferred;
      current.updatedAt = new Date(); 
      res.json(current);
      resources.reactor.emit('person.update', {previous: person, current}, {sessionId: req.sessionId});
    });
  });

  app.delete('/person/:id', checkRights('person.delete'), function(req, res, next){
    let id = ObjectId(req.params.id); 
    async.waterfall([
      del.bind(null, id), 
      Preference.delete.bind(null, req.user), 
      findOne
    ], (err, person) => {
      if(err)return next(err);
      res.json({_id: id, isDeleted: true});
      resources.reactor.emit('person.delete', Maker(person), {sessionId: req.sessionId});
    });
  })

  app.post('/people', checkRights('person.new'), function(req, res, next){
    const person = req.body.person;
    const isPreferred = Boolean(req.body.person.preferred);
    async.waterfall([
      create.bind(null, person), 
      loadOne,
      Preference.update.bind(Preference, 'person', req.user, isPreferred)
    ], (err, person) => {
      if(err)return next(err);
      const current = Maker(person);
      current.preferred = isPreferred;
      res.json(current);
      resources.reactor.emit('person.new', current, {sessionId: req.sessionId});
    });
  });

  app.put('/person', checkRights('person.update'), function(req, res, next){
    const updates = fromJson(req.body.person);
    const id = ObjectId(req.body.person._id);
    const isPreferred = Boolean(req.body.person.preferred);
    async.waterfall([
      loadOne.bind(null, id), 
      update.bind(null, updates), 
      (previous, cb) => loadOne(previous._id, (err, person) => cb(err, previous, person)),
      (previous, person, cb) => {
        Preference.update('person', req.user, isPreferred, person, err => cb(err, previous, person))
      },
    ], (err, previous, person) => {
      if(err) return next(err);
      const current = Maker(person);
      current.preferred = isPreferred;
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
    return cb(err, newPerson._id)
  })
}

function update(updates, previousPerson, cb){
  Person.collection.updateOne({_id: previousPerson._id}, {$set: updates}, (err) => {
    return cb(err, previousPerson)
  })
}


function del(id, cb){
  Person.collection.updateOne({_id: id}, {$set: {isDeleted: true}}, (err) => {
    return cb(err, id)
  })
}

function fromJson(json){
  let attrs = ['prefix', 'firstName', 'lastName', 'type', 'jobType', 'jobDescription', 'department', 'roles', 'email', 'birthdate', 'note'];
  let res = _.pick(json, attrs);
  res.companyId = json.companyId ? ObjectId(json.companyId) : undefined;
  if(res.type !== 'worker') res.roles = undefined;
  if(res.type === 'worker' && json.skills){
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
  if(json.tags){
    const tags = _.inject(json.tags, (res, tag) => { 
      const t = uppercamelcase(tag);
      res[t] = t; return res
    }, {});
    res.tags = _.chain(tags).values().compact().sort().value();
  }
  res.updatedAt = new Date(); 
  return res;
}

function Maker(person){
  //person.name = [person.firstName, person.lastName].join(' ');
  person.name = person.fullName();
  person.isNew = moment.duration( moment() - (person.createdAt || new Date(1967, 9, 1)) ).asDays() < 1;
  person.isUpdated = moment.duration(moment() - (person.updatedAt || new Date(1967, 9, 1)) ).asHours() < 1;
  return person;
}
