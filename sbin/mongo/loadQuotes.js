// run as: "babel-node --stage 0 <file>"
// or ../../node_modules/babel/bin/babel-node.js --stage 0 <file>

import mongobless from 'mongobless';
import {Product, Quote} from '../../src/server/models';
import async from 'async';
import _ from 'lodash';
import faker from 'faker';
import {getRandomInt, makeFakeObject} from './util';
import params from '../../params';


const COUNT = 1000;

mongobless.connect(params.db, (err) => {
  if(err) throw err;
  async.waterfall([loadProducts, insert], (err, data) => {
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
  Product.findAll({}, cb);
}

function insert(products, cb){
  const quotes = generate(products);
  Quote.collection.insertMany(quotes, err => cb(err, quotes));
}

function generate(products){
  return _(products).map( product => {
   return _.times(_.random(1, COUNT), () => {
     return {
       date: faker.date.past(),
       price: Number(faker.commerce.price()),
       productId: product._id
     }
   });
  }).flatten().value();
}

