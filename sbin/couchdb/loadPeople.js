import {PouchDB, db, makeFakeObject}  from './util';
import async from 'async';
import _ from 'lodash';
import uuid from 'uuid';


require('better-log').install();

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

const COUNT = 200;

async.waterfall([generate, insert], (err, data) => {
  if(err)console.log(err);
  console.log(data)
  console.log("The end ...");
});


function insert(data, cb){
  console.log(data)
  console.log("insert ...");
  db.bulkDocs(data, cb);
}

function generate(cb){
  const data = _.times(COUNT, makeFakeObject.bind(null, fakeSchema));
  _.each(data, c =>  c._id = uuid.v1() );
  cb(null, data);
}


