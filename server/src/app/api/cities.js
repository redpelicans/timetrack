import async from 'async';
import _ from 'lodash';
import {Person, Company} from '../../models';
import {ObjectId} from '../../helpers';

const basecities = [
  "Paris",
];

export function init(app){
  app.get('/cities', function(req, res, next){
    async.waterfall([load], (err, cities) => {
      if(err)return next(err);
      //const hbasecities = _.chain(basecities).map( city => [city, city] ).object().value();
      const hbasecities = _.reduce(basecities, (res,city) => {res[city] = city; return res}, {});
      const allcities = _.merge(hbasecities, cities);
      res.json(_.values(allcities).sort());
    })
  });
}


function load(cb){
  Company.findAll({isDeleted: {$ne: true}, 'address.city': {$exists: true}}, {'address.city': 1}, (err, companies) => {
    if(err)return next(err);
    const hallcities = {};
    for(let company of companies){ hallcities[company.address.city] = company.address.city }
    cb(null, hallcities);
  });
}
