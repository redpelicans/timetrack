import async from 'async';
import moment from 'moment';
import _ from 'lodash';
import {Person, Company, Preference} from '../../models';
import {getRandomInt, ObjectId} from '../../helpers';
import checkUser from '../../middleware/check_user';
import checkRights from '../../middleware/check_rights';
import uppercamelcase  from 'uppercamelcase';

export function init(app, resources){

  app.get('/companies', function(req, res, next){
    const ids = _.map(req.query.ids, id => ObjectId(id));
    async.waterfall([
      loadAll.bind(null, ids), 
      Preference.spread.bind(Preference, 'company', req.user),
      computeBill
    ], (err, companies) => {
      if(err) return next(err);
      res.json(_.map(companies, p => Maker(p)));
    });
  });

  app.post('/companies/preferred', checkRights('company.update'), function(req, res, next){
    const id = ObjectId(req.body.id); 
    const isPreferred = Boolean(req.body.preferred);
    async.waterfall([
      loadOne.bind(null, id), 
      Preference.update.bind(Preference, 'company', req.user, isPreferred)
    ], (err, company) => {
      if(err)return next(err);
      const current = Maker(company);
      current.preferred = isPreferred;
      current.updatedAt = new Date(); 
      res.json(current);
      resources.reactor.emit('company.update', {previous: company, current}, {sessionId: req.sessionId});
    });
  });

  app.delete('/company/:id', checkRights('company.delete'), function(req, res, next){
    let id = ObjectId(req.params.id); 
    async.waterfall([
      del.bind(null, id), 
      Preference.delete.bind(null, req.user), 
      findOne
    ], (err, company) => {
      if(err)return next(err);
      res.json({_id: id, isDeleted: true});
      resources.reactor.emit('company.delete', Maker(company), {sessionId: req.sessionId});
    });
  })

  app.post('/companies', checkRights('company.new'), function(req, res, next){
    const company = req.body.company;
    const isPreferred = Boolean(req.body.company.preferred);
    async.waterfall([
      create.bind(null, company), 
      loadOne,
      Preference.update.bind(Preference, 'company', req.user, isPreferred)
    ], (err, company) => {
      if(err)return next(err);
      const current = Maker(company);
      res.json(current);
      resources.reactor.emit('company.new', current, {sessionId: req.sessionId});
    });
  });

  app.put('/company', checkRights('company.update'), function(req, res, next){
    const updates = fromJson(req.body.company);
    const id = ObjectId(req.body.company._id);
    const isPreferred = Boolean(req.body.company.preferred);
    async.waterfall([
      loadOne.bind(null, id), 
      update.bind(null, updates), 
      (previous, cb) => loadOne(previous._id, (err, company) => cb(err, previous, company)),
      (previous, company, cb) => {
        Preference.update('company', req.user, isPreferred, company, err => cb(err, previous, company))
      },
    ], (err, previous, company) => {
      if(err)return next(err);
      const current = Maker(company);
      current.preferred = isPreferred;
      res.json(current);
      resources.reactor.emit('company.update', {previous, current}, {sessionId: req.sessionId});
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
  if(json.tags){
    const tags = _.inject(json.tags, (res, tag) => { 
      const t = uppercamelcase(tag);
      res[t] = t; return res
    }, {});
    res.tags = _.chain(tags).values().compact().sort().value();
  }

  //res.updatedAt = new Date(); 
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


function update(updates, previousCompany, cb){
  updates.updatedAt = new Date(); 
  Company.collection.updateOne({_id: previousCompany._id}, {$set: updates}, (err) => {
    return cb(err, previousCompany)
  })
}

function findOne(id, cb){
  Company.findOne({_id: id}, (err, company) => {
    if(err)return next(err);
    if(!company)return cb(new Error(`Unknown company: '${id}'`));
    cb(null, company);
  });
}

function del(id, cb){
  Company.collection.updateOne({_id: id}, {$set: {updatedAt: new Date(), isDeleted: true}}, (err) => {
    return cb(err, id)
  })
}

function Maker(obj){
  obj.createdAt = obj.createdAt || new Date(1967, 9, 1);
  if( !obj.updatedAt &&  moment.duration( moment() - obj.createdAt ).asHours() < 2 ) obj.isNew = true;
  else if( obj.updatedAt && moment.duration(moment() - obj.updatedAt).asHours() < 1) obj.isUpdated = true;
  return obj;
}
