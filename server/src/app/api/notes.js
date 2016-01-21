import async from 'async';
import _ from 'lodash';
import {Note} from '../../models';
import {ObjectId} from '../../helpers';
import checkRights  from '../../middleware/check_rights';

export function init(app, resources){
  app.get('/notes', function(req, res, next){
    async.waterfall([
      loadAll,
    ], (err, notes) => {
      if(err)return next(err);
      res.json(notes);
    })
  });

  // TODO: should check right depending on entity
  app.post('/notes', function(req, res, next){
    const note = req.body.note;
    async.waterfall([
      loadEntity.bind(null, entityId),
      create.bind(null, note, req.user), 
      loadOne,
    ], (err, note) => {
      if(err)return next(err);
      const current = Maker(note);
      res.json(current);
      resources.reactor.emit('note.new', current, {sessionId: req.sessionId});
    });
  });


  // TODO: should check right depending on entity
  app.put('/note', function(req, res, next){
    const updates = fromJson(req.body.note);
    updates.authorId = req.user._id;
    const id = ObjectId(req.body.note._id);
    async.waterfall([
      loadOne.bind(null, id), 
      update.bind(null, updates), 
      (previous, cb) => loadOne(previous._id, (err, person) => cb(err, previous, person)),
    ], (err, previous, note) => {
      if(err) return next(err);
      const current = Maker(note);
      res.json(current);
      resources.reactor.emit('note.update', {previous, current}, {sessionId: req.sessionId});
    });
  });

  app.delete('/note/:id', function(req, res, next){
    let id = ObjectId(req.params.id); 
    async.waterfall([
      del.bind(null, id), 
      findOne
    ], (err, note) => {
      if(err)return next(err);
      res.json({_id: id, isDeleted: true});
      resources.reactor.emit('note.delete', Maker(note), {sessionId: req.sessionId});
    });
  })
}

function loadAll(cb){
  Note.findAll({isDeleted: {$ne: true}}, cb);
}

function findOne(id, cb){
  Note.findOne({_id: id}, (err, note) => {
    if(err)return next(err);
    if(!note)return cb(new Error(`Unknown note: '${id}'`));
    cb(null, note);
  });
}

function loadOne(id, cb){
  Note.loadOne(id, (err, note) => {
    if(err)return next(err);
    if(!note)return cb(new Error(`Unknown note: '${id}'`));
    cb(null, note);
  });
}

function create(note, user, cb){
  let newNote = fromJson(note) ;
  newNote.authorId = user._id;
  newNote.createdAt = new Date();
  Note.collection.insertOne(newNote, (err, _) => {
    return cb(err, newNote._id)
  })
}

function update(updates, previousNote, cb){
  updates.updatedAt = new Date(); 
  Note.collection.updateOne({_id: previousNote._id}, {$set: updates}, (err) => {
    return cb(err, previousNote)
  })
}

function del(id, cb){
  Note.collection.updateOne({_id: id}, {$set: {updatedAt: new Date(), isDeleted: true}}, (err) => {
    return cb(err, id)
  })
}

function Maker(obj){
  return obj;
}

function fromJson(json){
  let attrs = ['content'];
  let res = _.pick(json, attrs);
  if(json.entityId) res.entityId = ObjectId(json.entityId);
  return res;
}


