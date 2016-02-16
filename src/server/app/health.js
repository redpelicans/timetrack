// useful for monitoring
import async from 'async';
import {Person} from '../models';


export function init(app){
  app.get('/health', function(req, res){
    Person.findAll({}, {limit: 1}, err => {
      res.json({health: !!!err});
    });
  });
}
