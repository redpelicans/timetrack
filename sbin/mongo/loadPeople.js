// run as: "babel-node --stage 0 loadClients.js"

import mongobless from 'mongobless';
import {Company, Person} from '../../server/src/models';
import async from 'async';
import _ from 'lodash';
import {getRandomInt, makeFakeObject} from './util';
import params from '../../params';


const fakeSchema = {
    type: '#contact'
  , prefix: 'name.prefix'
  , firstName: 'name.firstName'
  , lastName: 'name.lastName'
  , jobTitle: 'name.jobTitle'
  , jobDescriptor: 'name.jobDescriptor'
  , department: 'commerce.department'
  , email: 'internet.email'
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

const me = {
    type: 'contact'
  , prefix: 'Mr'
  , firstName: 'eric'
  , lastName: 'basley'
  , jobTitle: 'President'
  , email: 'eric.basley@redpelicans.com'
  , birthdate: new Date(1967, 1, 9)
  , phones: [{
        label: 'mobile'
      , phone: '06 85 80 63 16'
    }]
  , createdAt: new Date()
};



const COUNT = 100;

mongobless.connect(params.db, (err) => {
  if(err) throw err;
  async.waterfall([loadCompanies, generate, insert], (err, data) => {
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
  obj.push(me);
  Person.collection.insertMany(obj, err => cb(err, obj));
}

function loadCompanies(cb){
  Company.findAll({isDeleted: {$ne: true}}, cb);
}

function generate(companies, cb){
  function make(schema){
    const obj = makeFakeObject(schema); 
    const company = companies[getRandomInt(0, companies.length-1)];
    obj.companyId = company._id;
    return obj;
  }

  cb(null, _.times(COUNT, make.bind(null, fakeSchema)));
}

