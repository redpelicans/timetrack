import async from 'async';
import _ from 'lodash';
import {Person, Company} from '../../models';
import {ObjectId} from '../../helpers';

const base = [
  "France",
];

export function init(app){
  app.get('/countries', function(req, res, next){
    async.waterfall([load], (err, countries) => {
      if(err)return next(err);
      const hbasecountries = _.reduce(base, (res, country) => {res[country] = country; return res}, {});
      const allcountries = _.merge(hbasecountries, countries);
      res.json(_.values(allcountries).sort());
    })
  });
}


function load(cb){
  Company.findAll({isDeleted: {$ne: true}, 'address.country': {$exists: true}}, {'address.country': 1}, (err, companies) => {
    if(err)return next(err);
    const hallcountries = {};
    for(let company of companies){ hallcountries[company.address.country] = company.address.country }
    cb(null, hallcountries);
  });
}
