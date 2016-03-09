// run as: "babel-node --stage 0 <file>"
// or ../../node_modules/babel/bin/babel-node.js --stage 0 <file>

import mongobless from 'mongobless';
import {Product} from '../../src/server/models';
import async from 'async';
import _ from 'lodash';
import {getRandomInt, makeFakeObject} from './util';
import params from '../../params';


const productSchema = {
    label: 'commerce.productName'
  , type: 'commerce.productAdjective' 
  , createdAt: 'date.recent' 
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
  Product.collection.insertMany(obj, err => cb(err, obj));
}

function generate(cb){
  cb(null, _.times(COUNT, makeFakeObject.bind(null, productSchema)));
}

