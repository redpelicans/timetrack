import async from 'async';
import moment from 'moment';
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

  app.post('/notes', function(req, res, next){
    const note = req.body.note;
    async.waterfall([
      create.bind(null, note, req.user),
      loadOne,
    ], (err, note) => {
      if(err)return next(err);
      const current = Maker(note);
      res.json(current);
      resources.reactor.emit('note.new', current, {sessionId: req.sessionId});
    });
  });


  app.put('/note', function(req, res, next){
    const updates = fromJson(req.body.note);
    updates.authorId = req.user._id;
    const id = ObjectId(req.body.note._id);
    async.waterfall([
      loadOne.bind(null, id),
      checkUserUpdateDeleteRights.bind(null, req.user),
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
      loadOne.bind(null, id),
      checkUserUpdateDeleteRights.bind(null, req.user),
      del,
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
  newNote.authorId   = user._id;
  newNote.entityId   = newNote.entityId;
  newNote.entityType = newNote.entityType;
  newNote.createdAt  = new Date();
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

function del(note, cb){
  Note.collection.updateOne({_id: note._id}, {$set: {updatedAt: new Date(), isDeleted: true}}, (err) => {
    return cb(err, note._id)
  })
}

function checkUserUpdateDeleteRights(user, note, cb){
  if(user.isAdmin() || user._id.equals(note.authorId)) return setImmediate(cb, null, note);
  return setImmediate(cb, new Unauthorized())
}

function Maker(obj){
  return obj
}

function fromJson(json){
  let attrs = ['content', 'entityType', 'assigneesIds', 'notification', 'status']
  let res = _.pick(json, attrs)
  if (json.dueDate) res.dueDate = moment(json.dueDate).toDate()
  if (json.entityId){
    res.entityId = ObjectId(json.entityId)
  }else{
    res.entityId = undefined
    res.entityType = undefined
  }
  return res
}
