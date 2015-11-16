import {PouchDB, db, makeFakeObject}  from './util';
import async from 'async';
import _ from 'lodash';
import uuid from 'uuid';



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

async.waterfall([generate, insert], (err, data) => {
  if(err)console.log(err);
  console.log(data)
  console.log("The end ...");
});


function insert(data, cb){
  console.log(data)
  console.log("insert...");
  db.bulkDocs(data, cb);
}

function generate(cb){
  const data = _.times(COUNT, makeFakeObject.bind(null, fakeSchema));
  _.each(data, c =>  c._id = uuid.v1() );
  cb(null, data);
}


