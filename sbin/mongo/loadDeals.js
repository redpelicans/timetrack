// run as: "babel-node --stage 0 <file>"
// or ../../node_modules/babel/bin/babel-node.js --stage 0 <file>

import mongobless from 'mongobless';
import {Product, Company, Deal} from '../../src/server/models';
import async from 'async';
import _ from 'lodash';
import faker from 'faker';
import {getRandomInt, makeFakeObject} from './util';
import params from '../../params';


const COUNT = 3000;

mongobless.connect(params.db, (err) => {
  if(err) throw err;
  async.waterfall([loadProducts, loadCompanies, insert], (err, data) => {
    if(err){
      mongobless.close();
      throw err;
    }
    console.log(data);
    console.log("Data loaded.");
    mongobless.close();
  });
});

function loadProducts(cb) {
  Product.findAll({}, (err, products) => cb(err, {products}));
}

function loadCompanies(data, cb) {
  Company.findAll({}, (err, companies) => cb(err, {...data, companies}));
}

function insert({companies, products}, cb){
  const deals = generate(companies, products);
  Deal.collection.insertMany(deals, err => cb(err, deals));
}

function generate(companies, products){
 return _.times(COUNT, () => {
   return {
     date: faker.date.past(),
     companyId: companies[_.random(0, companies.length-1)]._id,
     productId: products[_.random(0, products.length-1)]._id,
     quantity: faker.random.number(),
     buyOrSell: faker.random.boolean() ? 'buy' : 'sell',
   }
 });
}

