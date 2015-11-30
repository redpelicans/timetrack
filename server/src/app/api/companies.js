import async from 'async';
import moment from 'moment';
import _ from 'lodash';
import {Person, Company} from '../../models';
import {getRandomInt, ObjectId} from '../../helpers';
import checkUser  from '../../middleware/check_user';



export function init(app){
  app.get('/companies', function(req, res, next){
    const ids = _.map(req.query.ids, id => ObjectId(id));
    async.waterfall([loadAll.bind(null, ids), computeBill], (err, companies) => {
      if(err) return next(err);
      res.json(_.map(companies, p => Maker(p)));
    });
  });

  app.get('/company/:id', function(req, res, next){
    let id = ObjectId(req.params.id); 
    async.waterfall([loadOne.bind(null, id)], (err, company) => {
      if(err)return next(err);
      res.json(Maker(company));
    });
  })

  app.delete('/company/:id', checkUser('admin'), function(req, res, next){
    let id = ObjectId(req.params.id); 
    async.waterfall([del.bind(null, id)], (err) => {
      if(err)return next(err);
      res.json({_id: id, isDeleted: true});
    });
  })


  app.post('/companies/preferred', checkUser('admin'), function(req, res, next){
    let id = ObjectId(req.body.id); 
    async.waterfall([loadOne.bind(null, id), preferred.bind(null, Boolean(req.body.preferred))], (err, company) => {
      if(err)return next(err);
      res.json(Maker(company));
    });
  });

  app.post('/companies', checkUser('admin'), function(req, res, next){
    let company = req.body.company;
    async.waterfall([create.bind(null, company), loadOne], (err, company) => {
      if(err)return next(err);
      res.json(Maker(company));
    });
  });

  app.put('/company', checkUser('admin'), function(req, res, next){
    let newCompany = req.body.company;
    let id = ObjectId(newCompany._id);
    async.waterfall([loadOne.bind(null, id), update.bind(null, newCompany), loadOne], (err, company) => {
      if(err)return next(err);
      res.json(Maker(company));
    });
  });

}

function fromJson(json){
  let attrs = ['name', 'type', 'preferred', 'website', 'note'];
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

function loadPersonsCompany(company, cb){
  const query = {
    companyId: company._id,
    isDeleted: {$ne: true}
  };
  Person.findAll(query, (err, persons) => {
    if(err) return cb(err);
    company.personIds = _.map(persons, p => p._id);
    cb(null, company);
  });
}

function loadAll(ids, cb){
  function load(cb){
    const query = { isDeleted: {$ne: true}};
    if(ids.length) query._id = {$in: ids};
    Company.findAll(query, cb);
  }

  function loadPersons(companies, cb){
    async.map(companies, loadPersonsCompany, cb);
  }

  async.waterfall([load, loadPersons], cb);
}

function loadOne(id, cb){

  function load(cb){
    Company.findOne(query, (err, company) => {
      if(err) return cb(err);
      if(!company) return cb(new Error(`Unknown company: '${id}'`));
      cb(null, company);
    });
  }

  let query = {
    _id: id,
    isDeleted: {$ne: true},
  };

  async.waterfall([load, loadPersonsCompany], cb);
}

function create(company, cb){
  let newCompany = fromJson(company) ;
  newCompany.createdAt = new Date();
  Company.collection.insertOne(newCompany, (err, _) => {
    //console.log(newCompany);
    return cb(err, newCompany._id)
  })
}


function update(newCompany, previousCompany, cb){
  let updates = fromJson(newCompany) ;
  Company.collection.updateOne({_id: previousCompany._id}, {$set: updates}, (err) => {
    //console.log(updates);
    return cb(err, previousCompany._id)
  })
}

function del(id, cb){
  Company.collection.updateOne({_id: id}, {$set: {isDeleted: true}}, (err) => {
    return cb(err)
  })
}

function preferred(isPreferred, company, cb){
  company.preferred = isPreferred;
  Company.collection.update({_id: company._id}, {$set: {preferred: company.preferred}}, err => {
    cb(err, company);
  });
}

function Maker(obj){
  obj.isNew = moment.duration(moment() - obj.createdAt).asDays() < 1;
  return obj;
}
