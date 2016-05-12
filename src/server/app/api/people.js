import async from 'async';
import moment from 'moment';
import _ from 'lodash';
import {Person, Preference, Note} from '../../models';
import {ObjectId, Unauthorized} from '../../helpers';
import checkUser  from '../../middleware/check_user';
import checkRights  from '../../middleware/check_rights';
import uppercamelcase  from 'uppercamelcase';

export function init(app, resources){
  app.get('/people', checkRights('person.view'), function(req, res, next){
    async.waterfall([
      loadAll, 
      Preference.spread.bind(Preference, 'person', req.user),
    ], (err, people) => {
      if(err)return next(err);
      res.json(_.map(people, p => Maker(p)));
    });
  });

  app.post('/people/preferred', checkRights('person.preferred'), function(req, res, next){
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
    function emitBeforeDeleting(person, cb){
      resources.reactor.emit('person.delete', Maker(person), {sessionId: req.sessionId});
      setImmediate(cb, null, person)
    }

    let id = ObjectId(req.params.id); 
    async.waterfall([
      loadOne.bind(null, id),
      checkUserUpdateRights.bind(null, req.user),
      emitBeforeDeleting,
      del, 
      Preference.delete.bind(null, req.user), 
      Note.deleteForOneEntity,
      findOne
    ], (err, person) => {
      if(err)return next(err);
      res.json({_id: id, isDeleted: true});
      resources.reactor.emit('note.entity.delete', Maker(person));
    });
  })

  app.post('/people', checkRights('person.new'), function(req, res, next){
    const person = req.body.person;
    const isPreferred = Boolean(req.body.person.preferred);
    const noteContent = req.body.person.note;
    async.waterfall([
      create.bind(null, req.user, person), 
      loadOne,
      Preference.update.bind(Preference, 'person', req.user, isPreferred),
      Note.create.bind(Note, noteContent, req.user),
    ], (err, person, note) => {
      if(err)return next(err);
      const current = Maker(person);
      current.preferred = isPreferred;
      res.json(current);
      resources.reactor.emit('person.new', current, {sessionId: req.sessionId});
      if(note)resources.reactor.emit('note.new', note);
    });
  });

  app.post('/people/tags', checkRights('person.update'), function(req, res, next){
    const tags = req.body.tags;
    const id = ObjectId(req.body._id);
    async.waterfall([
      loadOne.bind(null, id),
      checkUserUpdateRights.bind(null, req.user),
      updateTags.bind(null, tags),
      (previous, cb) => loadOne(previous._id, (err, person) => cb(err, previous, person)),
    ], (err, previous, person) => {
      if(err)return next(err);
      const current = Maker(person);
      res.json(current);
      resources.reactor.emit('person.update', {previous, current}, {sessionId: req.sessionId});
    });
  })

  app.put('/person', checkRights('person.update'), function(req, res, next){
    const updates = fromJson(req.body.person);
    const id = ObjectId(req.body.person._id);
    const isPreferred = Boolean(req.body.person.preferred);
    async.waterfall([
      loadOne.bind(null, id), 
      checkUserUpdateRights.bind(null, req.user),
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

  app.post('/person/check_email_uniqueness', function(req, res, next){
    let email = req.body.email && req.body.email.trim();
    Person.findAll({email: email, isDeleted: {$ne: true}}, {_id: 1}, (err, data) => {
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

function checkUserUpdateRights(user, person, cb){
  if(!user.isAdmin() && person.isWorker()) return setImmediate(cb, new Unauthorized())
  setImmediate(cb, null, person);
}

function create(user, person, cb){
  let newPerson = fromJson(person) ;
  if(!user.isAdmin() && person.type === 'worker') return setImmediate(cb, new Unauthorized())
  newPerson.createdAt = new Date();
  Person.collection.insertOne(newPerson, (err, _) => {
    return cb(err, newPerson._id)
  })
}

function update(updates, previousPerson, cb){
  updates.updatedAt = new Date(); 
  Person.collection.updateOne({_id: previousPerson._id}, {$set: updates}, (err) => {
    return cb(err, previousPerson)
  })
}

function updateTags(tags, person, cb){
  Person.collection.updateOne({_id: person._id}, {$set: {tags}}, (err) => cb(err, person) );
}

function del(person, cb){
  Person.collection.updateOne({_id: person._id}, {$set: {updatedAt: new Date(), isDeleted: true}}, (err) => {
    return cb(err, person._id)
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
    const tags = _.reduce(json.tags, (res, tag) => { 
      const t = uppercamelcase(tag);
      res[t] = t; return res
    }, {});
    res.tags = _.chain(tags).values().compact().sort().value();
  }
  //res.updatedAt = new Date(); 
  return res;
}

function Maker(person){
  person.name = person.fullName();
  person.createdAt = person.createdAt || new Date(1967, 9, 1);
  if( !person.updatedAt &&  moment.duration( moment() - person.createdAt ).asHours() < 2 ) person.isNew = true;
  else if( person.updatedAt && moment.duration(moment() - person.updatedAt).asHours() < 1) person.isUpdated = true;
  return person;
}
