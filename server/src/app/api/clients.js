import async from 'async';
import _ from 'lodash';
import {Client} from '../../models';

export function init(app){
  app.get('/clients', function(req, res, next){
    async.waterfall([loadClients], (err, clients) => {
      res.json(clients);
    });
  });
}

function loadClients(cb){
  Client.findAll({type: 'client'}, cb);
}

