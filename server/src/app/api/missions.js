import {Mission} from '../../models';

export function init(app) {
  app.get('/missions', (req, res, next) => {
    Mission.findAll((err, missions) => {
      if (err) return next(err);
      res.json(missions);
    })
  });
}
