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
      from = req.query.from ? moment(req.query.from, 'YYMMDD').startOf('day').toDate() :  moment().startOf('month').toDate();
      to = req.query.to ? moment(req.query.to, 'YYMMDD').endOf('day').toDate() :  moment().endOf('month').toDate();
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

}

const loadAll = (from, to, personIds, missionIds) => cb => {
  const query = {
    isDeleted: {$ne: true},
    startDate: {$lt: to},
    endDate: {$gt: from},
  };
  if(personIds)query.personIds = {$in: personIds};
  if(missionIds)query.missionIds = {$in: missionIds};

  console.log(query)
  Event.findAll( query, cb);
}

const Maker = mission => {
  return mission;
}
