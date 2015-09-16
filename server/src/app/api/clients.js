import async from 'async';
import _ from 'lodash';
import {Client} from '../../models';
import {getRandomInt, ObjectId} from '../../helpers';

export function init(app){
  app.get('/clients', function(req, res, next){
    async.waterfall([loadClients, computeBill], (err, clients) => {
      if(err)return next(err);
      res.json(clients);
    });
  });

  app.post('/clients/star', function(req, res, next){
    let id = ObjectId(req.body.id); 
    async.waterfall([loadClient.bind(null, id), star.bind(null, req.body.starred)], (err, client) => {
      if(err)return next(err);
      res.json(client);
    });
  });
}

function computeBill(clients, cb){
  function setBillElements(client, cb){
    if(getRandomInt(0,10) > 6){
      client.billed = getRandomInt(0, 50000);
      client.billable = getRandomInt(5000, 75000);
    }else{
      client.billed = 0;
      client.billable = 0;
    }
    setImmediate(cb);
  }
  async.map(clients, setBillElements, err => cb(err, clients));
}

function loadClients(cb){
  Client.findAll({type: 'client'}, cb);
}

function loadClient(id, cb){
  Client.findOne({type: 'client', _id: id}, cb);
}

function star(starred, client, cb){
  client.starred = {true: true, false: false}[starred] || false;
  Client.collection.update({_id: client._id}, {$set: {starred: client.starred}}, err => {
    cb(err, client);
  });
}
