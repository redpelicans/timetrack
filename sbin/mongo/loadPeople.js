// run as: "babel-node --stage 0 loadClients.js"

import mongobless from 'mongobless';
import {Person} from '../../server/src/models';
import async from 'async';
import _ from 'lodash';
import {makeFakeObject} from './util';
import params from '../../params';


const fakeSchema = {
    type: '#contact'
  , prefix: 'name.prefix'
  , firstName: 'name.firstName'
  , lastName: 'name.lastName'
  , jobTitle: 'name.jobTitle'
  , jobDescriptor: 'name.jobDescriptor'
  , jobArea: 'name.jobArea'
  , jobType: 'name.jobType'
  , birthdate: 'date.past'
  , phones: [{
        label: 'hacker.noun'
      , phone: 'phone.phoneNumber'
    }]
  , avatar: {
      type: '#url'
    , url: 'internet.avatar'
    , color: 'internet.color'
  }
  , createdAt: 'date.recent' 
  , note: 'lorem.paragraphs' 
};


const COUNT = 100;

mongobless.connect(params.db, (err) => {
  if(err) throw err;
  async.waterfall([generate, insert], (err, data) => {
    if(err){
      mongobless.close();
      throw err;
    }
    console.log(data);
    console.log("Data loaded.");
    mongobless.close();
  });
});

function insert(obj, cb){
  Person.collection.insertMany(obj, err => cb(err, obj));
}

function generate(cb){
  cb(null, _.times(COUNT, makeFakeObject.bind(null, fakeSchema)));
}

