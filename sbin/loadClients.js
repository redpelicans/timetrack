// run as: "babel-node --stage 0 loadClients.js"

import mongobless from 'mongobless';
import {Client} from '../server/src/models';
import async from 'async';
import _ from 'lodash';
import faker from 'faker';
import params from '../params';

faker.locale = 'en';

require('better-log').install();

const fakeSchema = {
    type: '#client'
  , name: 'company.companyName'
  , phones: [{
        label: 'hacker.noun'
      , phone: 'phone.phoneNumber'
    }]
  , address: {
        number: 'random.number'
      , street: 'address.streetName'
      , country: 'address.country'
    }
  , website: 'internet.url'
  , color: 'internet.color'
  , avatar: 'internet.avatar'
  , legalForm: 'hacker.adjective' 
  , createdAt: 'date.recent' 
  , note: 'lorem.paragraphs' 
};

const nbClients = 100;

mongobless.connect(params.db, (err) => {
  if(err) throw err;
  async.waterfall([generateClients, insertClients], (err, data) => {
    if(err){
      mongobless.close();
      throw err;
    }
    console.log(data);
    console.log("Data loaded.");
    mongobless.close();
  });
});

function insertClients(clients, cb){
  Client.collection.insertMany(clients, err => cb(err, clients));
}

function generateClients(cb){
  cb(null, _.times(100, makeFakeObject.bind(null, fakeSchema)));
}

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function makeFakeObject(schema){
  function fakeMe(property){
    if(property.startsWith('#')) return property.substr(1);
    let [p1, p2] = property.split('.');
    return faker[p1][p2]();
  }

  let res = {};
  //for(let [key, property] of Object.entries(schema)){
  for(let [key, property] of _.pairs(schema)){
    if(_.isString(property)){
      res[key] = fakeMe(property);
    }else if(_.isArray(property)){
      if(_.isString(property[0])){
        res[key] = _.times(getRandomInt(1, 3), () => fakeMe(property[0]));
      }else{
        res[key] = _.times(getRandomInt(1, 3), () => makeFakeObject(property[0]));
      }
    }else if(_.isObject(property)){
      res[key] = makeFakeObject(property);
    }
  }
  return res;
}

