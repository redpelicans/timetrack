import async from 'async';
import moment from 'moment';
import _ from 'lodash';
import {Event} from '../../models';
import {ObjectId} from '../../helpers';
import checkRights  from '../../middleware/check_rights';

export function init(app, resources) {

  app.get('/events', (req, res, next) => {
    let personIds, missionIds, from, to;
    try{
      if(req.query.personIds) personIds = _.map(req.query.personIds, ObjectId);
      if(req.query.missionIds) missionIds = _.map(req.query.missionIds, ObjectId);
      from = req.query.from ? moment(req.query.from, 'DDMMYY').startOf('day').toDate() :  moment().startOf('month').toDate();
      to = req.query.to ? moment(req.query.to, 'DDMMYY').endOf('day').toDate() :  moment().endOf('month').toDate();
    }catch(e){
      return res.status(500).json({message: "Wrong parameters"});
    }

    async.waterfall([
      loadAll(from, to, personIds, missionIds),
    ], (err, events) => {
      if (err) return next(err);
      res.json(_.map(events, Maker));
    })
  });

  app.post('/events', checkRights('event.new'), function(req, res, next){
    const event = req.body.event;
    async.waterfall([
      create.bind(null, event),
      loadOne,
    ], (err, event) => {
      if(err)return next(err);
      const current = Maker(event);
      res.json(current);
      resources.reactor.emit('event.new', current, {sessionId: req.sessionId});
    });
  });

  app.put('/event', checkRights('event.update'), function(req, res, next){
    const updates = fromJson(req.body.event);
    const id = ObjectId(req.body.event._id);
    async.waterfall([
      loadOne.bind(null, id),
      update.bind(null, updates),
      (previous, cb) => loadOne(previous._id, (err, event) => cb(err, previous, event)),
    ], (err, previous, event) => {
      if(err)return next(err);
      const current = Maker(event);
      res.json(current);
      resources.reactor.emit('event.update', {previous, current}, {sessionId: req.sessionId});
    });
  });

  app.delete('/event/:id', checkRights('event.delete'), function(req, res, next){
    let id = ObjectId(req.params.id);
    async.waterfall([
      del.bind(null, id),
      findOne
    ], (err, event) => {
      if(err)return next(err);
      res.json({_id: id, isDeleted: true});
      resources.reactor.emit('event.delete', Maker(event), {sessionId: req.sessionId});
    });
  })

}

const loadAll = (from, to, personIds, missionIds) => cb => {
  const query = {
    isDeleted: {$ne: true},
    startDate: {$lt: to},
    endDate: {$gt: from},
  };
  if(personIds)query.personIds = {$in: personIds};
  if(missionIds)query.missionIds = {$in: missionIds};

  Event.findAll( query, cb);
}

function loadOne(id, cb){
  Event.loadOne(id, (err, event) => {
    if(err)return next(err);
    if(!event)return cb(new Error(`Unknown event: '${id}'`));
    cb(null, event);
  });
}

function findOne(id, cb){
  Event.findOne({_id: id}, (err, event) => {
    if(err)return next(err);
    if(!event)return cb(new Error(`Unknown event: '${id}'`));
    cb(null, event);
  });
}

function update(updates, previousEvent, cb){
  updates.updatedAt = new Date();
  Event.collection.updateOne({_id: previousEvent._id}, {$set: updates}, (err) => {
    return cb(err, previousEvent)
  })
}

function del(id, cb){
  const updates = {
    isDeleted: true,
    updatedAt: new Date()
  };
  Event.collection.updateOne({_id: id}, {$set: updates}, (err) => {
    return cb(err, id)
  })
}


function create(event, cb){
  let newEvent = fromJson(event) ;
  newEvent.createdAt = new Date();
  Event.collection.insertOne(newEvent, (err, _) => {
    return cb(err, newEvent._id)
  })
}

function fromJson(json){
  let attrs = ['label', 'description', 'status', 'unit', 'type', 'value'];
  let res = _.pick(json, attrs);
  if(json.startDate)res.startDate = moment(json.startDate).startOf('day').toDate();
  if(json.endDate)res.endDate = moment(json.endDate).endOf('day').toDate();
  res.workerId = ObjectId(json.workerId);
  res.missionId = json.missionId ? ObjectId(json.missionId) : undefined;
  return res;
}


const Maker = event => {
  return event;
}
