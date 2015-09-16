import async from 'async';
import _ from 'lodash';
import {Company} from '../../models';
import {getRandomInt, ObjectId} from '../../helpers';

export function init(app){
  app.get('/companies', function(req, res, next){
    async.waterfall([loadCompanies, computeBill], (err, companies) => {
      if(err)return next(err);
      res.json(companies);
    });
  });

  app.post('/companies/star', function(req, res, next){
    let id = ObjectId(req.body.id); 
    async.waterfall([loadCompany.bind(null, id), star.bind(null, req.body.starred)], (err, company) => {
      if(err)return next(err);
      res.json(company);
    });
  });
}

function computeBill(companies, cb){
  function setBillElements(company, cb){
    if(getRandomInt(0,10) > 6){
      company.billed = getRandomInt(0, 50000);
      company.billable = getRandomInt(5000, 75000);
    }else{
      company.billed = 0;
      company.billable = 0;
    }
    setImmediate(cb);
  }
  async.map(companies, setBillElements, err => cb(err, companies));
}

function loadCompanies(cb){
  Company.findAll({}, cb);
}

function loadCompany(id, cb){
  Company.findOne({_id: id}, cb);
}

function star(starred, company, cb){
  company.starred = {true: true, false: false}[starred] || false;
  Company.collection.update({_id: company._id}, {$set: {starred: company.starred}}, err => {
    cb(err, company);
  });
}
