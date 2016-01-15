import async from 'async';
import moment from 'moment';
import _ from 'lodash';
import {Mission, Note} from '../../models';
import {ObjectId} from '../../helpers';
import checkRights  from '../../middleware/check_rights';

export function init(app, resources) {
  app.get('/missions', (req, res, next) => {
    async.waterfall([
      loadAll, 
    ], (err, missions) => {
      if (err) return next(err);
      res.json(_.map(missions, m => Maker(m)));
    })
  });

  app.post('/missions', checkRights('mission.new'), function(req, res, next){
    const mission = req.body.mission;
    async.waterfall([
      create.bind(null, mission), 
      loadOne,
    ], (err, mission) => {
      if(err)return next(err);
      const current = Maker(mission);
      res.json(current);
      resources.reactor.emit('mission.new', current, {sessionId: req.sessionId});
    });
  });

  app.put('/mission', checkRights('mission.update'), function(req, res, next){
    const updates = fromJson(req.body.mission);
    const id = ObjectId(req.body.mission._id);
    async.waterfall([
      loadOne.bind(null, id), 
      update.bind(null, updates), 
      (previous, cb) => loadOne(previous._id, (err, mission) => cb(err, previous, mission)),
    ], (err, previous, mission) => {
      if(err)return next(err);
      const current = Maker(mission);
      res.json(current);
      resources.reactor.emit('mission.update', {previous, current}, {sessionId: req.sessionId});
    });
  });

  app.delete('/mission/:id', checkRights('mission.delete'), function(req, res, next){
    let id = ObjectId(req.params.id); 
    async.waterfall([
      del.bind(null, id), 
      findOne
    ], (err, mission) => {
      if(err)return next(err);
      res.json({_id: id, isDeleted: true});
      resources.reactor.emit('mission.delete', Maker(mission), {sessionId: req.sessionId});
    });
  })
}

function loadAll(cb){
  Mission.findAll({isDeleted: {$ne: true}}, cb);
}

function loadOne(id, cb){
  Mission.loadOne(id, (err, mission) => {
    if(err)return next(err);
    if(!mission)return cb(new Error(`Unknown mission: '${id}'`));
    cb(null, mission);
  });
}

function findOne(id, cb){
  Mission.findOne({_id: id}, (err, mission) => {
    if(err)return next(err);
    if(!mission)return cb(new Error(`Unknown mission: '${id}'`));
    cb(null, mission);
  });
}

function create(mission, cb){
  let newMission = fromJson(mission) ;
  newMission.createdAt = new Date();
  Mission.collection.insertOne(newMission, (err, _) => {
    return cb(err, newMission._id)
  })
}

function update(updates, previousMission, cb){
  updates.updatedAt = new Date();
  Mission.collection.updateOne({_id: previousMission._id}, {$set: updates}, (err) => {
    return cb(err, previousMission)
  })
}

function del(id, cb){
  const updates = {
    isDeleted: true,
    updatedAt: new Date()
  };
  Mission.collection.updateOne({_id: id}, {$set: updates}, (err) => {
    return cb(err, id)
  })
}

function fromJson(json){
  //console.log(json);
  let attrs = ['name', 'note', 'status', 'timesheetUnit', 'allowWeekends'];
  let res = _.pick(json, attrs);
  if(res.status !== 'closed')res.status='open';
  if(json.startDate)res.startDate = moment(json.startDate).toDate();
  if(json.endDate)res.endDate = moment(json.endDate).toDate();
  res.clientId = json.clientId ? ObjectId(json.clientId) : undefined;
  res.managerId = json.managerId ? ObjectId(json.managerId) : undefined;
  if(json.workerIds){
    res.workerIds = _.chain(json.workerIds).compact().map( ObjectId ).value();
  }
  //res.updatedAt = new Date(); 
  return res;
}

function Maker(mission){
  mission.createdAt = mission.createdAt || new Date(1967, 9, 1);
  if( !mission.updatedAt &&  moment.duration( moment() - mission.createdAt ).asHours() < 2 ) mission.isNew = true;
  else if( mission.updatedAt && moment.duration(moment() - mission.updatedAt).asHours() < 1) mission.isUpdated = true;
  mission.isClosed = mission.status === 'closed';
  return mission;
}
