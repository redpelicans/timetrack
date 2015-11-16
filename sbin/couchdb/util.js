// run as: "babel-node --stage 0 loadClients.js"

import PouchDB  from 'pouchdb';
import _ from 'lodash';
import faker from 'faker';
faker.locale = 'en';
require('better-log').install();

const db = new PouchDB('http://rp1.redpelicans.com:5984/timetrack', {
  auth:{
    username: 'admin',
    password: 'pasdire'
  }})


function makeFakeObject(schema){
  function fakeMe(property){
    if(property.startsWith('#')) return property.substr(1);
    let [p1, p2] = property.split('.');
    return faker[p1][p2]();
  }

  let res = {};
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

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {PouchDB, db, makeFakeObject};
