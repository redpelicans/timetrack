import async from 'async';
import request from 'request';
import _ from 'lodash';
import faker from 'faker';
faker.locale = 'en';

const fakeSchema = {
    id: 'random.uuid'
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
  , emails: ['internet.email']
  , website: 'internet.url'
  , color: 'internet.color'
  , image: 'internet.avatar'
  , legalForm: 'hacker.adjective' 
  , createdAt: 'date.recent' 
  , note: 'lorem.paragraphs' 
};

// const locale = "fr";
// const fakerUrl = "http://faker.hook.io?property=";
//
//
// function requestFakeObject(schema, cb){
//   function requestFakeProperty(property, cb){
//     if(typeof schema[property] === 'string'){
//       let options = {
//         url: fakerUrl + schema[property],
//         headers: { 'Content-Type': 'application/json'}
//       };
//       request(options, (err, res, body) => {
//         if(err || res.statusCode != 200) return cb(null, {[property]: 'unknown'});
//         console.log(body)
//         cb(null, {[property]: JSON.parse(body)});
//       });
//     }else{
//       cb(null, {[property]: 'unknown'});
//     }
//   }
//
//   async.map(
//     Object.keys(schema), 
//     requestFakeProperty,
//     (err, data) => {
//       if(err)return next(err);
//       cb(null, _.assign(...data));
//     }
//   )
// }

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function makeFakeObject(schema){
  function fakeMe(property){
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

export function init(app){
  app.get('/clients', function(req, res, next){
    //let obj = makeFakeObject(fakeSchema);
    res.json(_.times(getRandomInt(10, 30), makeFakeObject.bind(null, fakeSchema)));
  });
}
