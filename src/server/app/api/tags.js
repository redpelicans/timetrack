import async from 'async';
import _ from 'lodash';
import {Person, Company} from '../../models';
import {ObjectId} from '../../helpers';
import checkRights  from '../../middleware/check_rights';

export function init(app, resources){
  app.get('/tags', function(req, res, next){
    async.parallel({companies, persons}, (err, data) => {
      if(err)return next(err);
      const htags = {};
      for(let company of data.companies){ 
        for(let tag of company.tags){
          if(!htags[tag]) htags[tag] = 1;
          else  htags[tag]++;
        }
      }
      for(let person of data.persons){ 
        for(let tag of person.tags){
          if(!htags[tag]) htags[tag] = 1;
          else  htags[tag]++;
        }
      }
      res.json(_.map(htags, (count, tag) => [tag, count]));
    })
  });

  app.get('/tag/:label', function(req, res, next) {
    let label = req.params.label
    if (!label) return res.json([])
    async.parallel({companies: companiesWithTag(label), persons: personsWithTag(label)}, (err, data) => {
      if (err) return next(err)
      //console.log('res = ', [...data.companies, ...data.persons])
      res.json([...data.companies, ...data.persons])
    })
  })


}

function companies(cb){
  Company.findAll({isDeleted: {$ne: true}, 'tags': {$exists: true}}, {'tags': 1}, cb);
}

function persons(cb){
  Person.findAll({isDeleted: {$ne: true}, 'tags': {$exists: true}}, {'tags': 1}, cb);
}

function companiesWithTag(tag){
  return cb => {
    Company.findAll({isDeleted: {$ne: true}, tags: tag}, {_id: 1}, (err, companies) =>{
      if(err)return cb(err);
      return cb(null, _.map(companies, company => { return {entityId: company._id, entityType: 'company'}}))
    });
  }
}

function personsWithTag(tag){
  return cb => {
    Person.findAll({isDeleted: {$ne: true}, tags: tag}, {_id: 1}, (err, persons) => {
      if(err)return cb(err);
      return cb(null, _.map(persons, person => { return {entityId: person._id, entityType: 'person'}}))
    });
  }
}
