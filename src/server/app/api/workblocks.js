import {Workblock} from '../../models';
import _ from 'lodash';
import {ObjectId} from '../../helpers';

export function init(app) {
  app.get('/workblocks', (req, res, next) => {
    Workblock.findAll((err, workblocks) => {
      if (err) return next(err);
      res.json(workblocks);
    });
  });

  app.post('/workblocks', (req, res, next) => {
    let attrs = ['missionId', 'startTime', 'quantity', 'description']
    Workblock.collection.insert(fromJSON(req.body, attrs), (err, result) => {
      if (err) return next(err);
      res.json(_.first(result.ops));
    });
  });

  app.put('/workblocks/:workblockId', (req, res, next) => {
    console.log(req.params.workblockId)
    Workblock.collection.findAndModify(
      {_id: ObjectId(req.params.workblockId)},
      null,
      {$set: fromJSON(req.body, ['quantity', 'description'])},
      (err, result) => {
        if (err) return next(err);
        res.json(result.value);
      }
    );
  });
}

function fromJSON(data, attrs) {
  let workblock = _.reduce(attrs, (memo, attr) => {
    if (_.has(data, attr)) memo[attr] = data[attr];
    return memo;
  }, {});
  if (!_.has(workblock, 'unit')) workblock.unit = 'day';
  if (!_.has(workblock, 'status')) workblock.unit = 'active';
  return workblock;
}
