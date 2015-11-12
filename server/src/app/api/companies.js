import async from 'async';
import _ from 'lodash';
import {Company} from '../../models';
import {getRandomInt, ObjectId} from '../../helpers';



export function init(app){
  app.get('/companies', function(req, res, next){
    async.waterfall([loadCompanies, computeBill], (err, companies) => {
      if(err)return next(err);
      // TODO: to be removed
      for(let company of companies){
        company.logoUrl = company.avatar;
      }
      res.json(companies);
    });
  });

  app.get('/company/:id', function(req, res, next){
    let id = ObjectId(req.params.id); 
    async.waterfall([loadCompany.bind(null, id)], (err, company) => {
      if(err)return next(err);
      res.json(company);
    });
  })

  app.delete('/company/:id', function(req, res, next){
    let id = ObjectId(req.params.id); 
    async.waterfall([deleteCompany.bind(null, id)], (err) => {
      if(err)return next(err);
      res.json({_id: id, isDeleted: true});
    });
  })


  app.post('/companies/star', function(req, res, next){
    let id = ObjectId(req.body.id); 
    async.waterfall([loadCompany.bind(null, id), star.bind(null, req.body.starred)], (err, company) => {
      if(err)return next(err);
      res.json(company);
    });
  });

  app.post('/companies', function(req, res, next){
    let company = req.body.company;
    async.waterfall([createCompany.bind(null, company), loadCompany], (err, company) => {
      if(err)return next(err);
      res.json(company);
    });
  });

  app.put('/company', function(req, res, next){
    let newCompany = req.body.company;
    let id = ObjectId(newCompany._id);
    async.waterfall([loadCompany.bind(null, id), updateCompany.bind(null, newCompany), loadCompany], (err, company) => {
      if(err)return next(err);
      res.json(company);
    });
  });

}

function companyFromJson(json){
  let attrs = ['name', 'type', 'starred', 'website', 'note'];
  let res = _.pick(json, attrs);
  if(json.address){
    let attrs = ['street', 'zipcode', 'city', 'country'];
    res.address = _.pick(json.address, attrs);
  }
  if(json.avatar){
    let attrs = ['src', 'url', 'color', 'type'];
    res.avatar = _.pick(json.avatar, attrs);
  }
  res.updatedAt = new Date(); 
  res.type = res.type.toLowerCase();
  return res;
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
  Company.findAll({isDeleted: {$ne: true}}, cb);
}

function loadCompany(id, cb){
  let query = {
    _id: id,
    isDeleted: {$ne: true},
  };
  Company.findOne(query, (err, company) => {
    if(err)return next(err);
    if(!company)return cb(new Error(`Unknown company: '${id}'`));
    cb(null, company);
  });
}

function createCompany(company, cb){
  let newCompany = companyFromJson(company) ;
  newCompany.createdAt = new Date();
  Company.collection.insertOne(newCompany, (err, _) => {
    //console.log(newCompany);
    return cb(err, newCompany._id)
  })
}


function updateCompany(newCompany, previousCompany, cb){
  let updates = companyFromJson(newCompany) ;
  Company.collection.updateOne({_id: previousCompany._id}, {$set: updates}, (err) => {
    //console.log(updates);
    return cb(err, previousCompany._id)
  })
}

function deleteCompany(id, cb){
  Company.collection.updateOne({_id: id}, {$set: {isDeleted: true}}, (err) => {
    return cb(err)
  })
}

function star(starred, company, cb){
  company.starred = {true: true, false: false}[starred] || false;
  Company.collection.update({_id: company._id}, {$set: {starred: company.starred}}, err => {
    cb(err, company);
  });
}
