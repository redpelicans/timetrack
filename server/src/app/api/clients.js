import async from 'async';
import _ from 'lodash';
import {Client} from '../../models';
import {getRandomInt} from '../../helpers';

export function init(app){
  app.get('/clients', function(req, res, next){
    async.waterfall([loadClients, computeBill], (err, clients) => {
      res.json(clients);
    });
  });
}

function computeBill(clients, cb){
  function setBillElements(client, cb){
    if(getRandomInt(0,10) > 6){
      client.billed = getRandomInt(0, 50000);
      client.billable = getRandomInt(5000, 75000);
    }
    setImmediate(cb);
  }

  async.map(clients, setBillElements, err => cb(err, clients));
}

function loadClients(cb){
  Client.findAll({type: 'client'}, cb);
}

