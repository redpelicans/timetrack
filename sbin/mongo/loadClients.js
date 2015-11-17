// run as: "babel-node --stage 0 loadClients.js"

import {Client} from '../server/src/models';
import async from 'async';
import _ from 'lodash';
import {getRandomInt, makeFakeObject} from './util';


const fakeSchema = {
    type: '#client'
  , name: 'company.companyName'
  , phones: [{
        label: 'hacker.noun'
      , phone: 'phone.phoneNumber'
    }]
  , address: {
        street: 'address.streetAddress'
      , zipcode: 'address.zipCode'
      , city: 'address.city'
      , country: 'address.country'
    }
  , website: 'internet.url'
  , avatar: {
      type: '#url'
    , url: 'internet.avatar'
    , color: 'internet.color'
  }
  , legalForm: 'hacker.adjective' 
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
  Client.collection.insertMany(obj, err => cb(err, obj));
}

function generate(companies, cb){
  cb(null, _.times(COUNT, makeFakeObject.bind(null, fakeSchema)));
}




