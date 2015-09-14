import {Workblock} from '../../models';

export function init(app) {
  app.get('/workblocks', (req, res, next) => {
    Workblock.findAll((err, workblocks) => {
      if (err) return next(err);
      res.json(workblocks);
    });
  });
}
