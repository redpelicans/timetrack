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
        for(let tag of company.tags) htags[tag] = tag; 
      }
      for(let person of data.persons){ 
        for(let tag of person.tags) htags[tag] = tag; 
      }
      res.json(_.values(htags).sort());
    })
  });

}

function companies(cb){
  Company.findAll({isDeleted: {$ne: true}, 'tags': {$exists: true}}, {'tags': 1}, cb);
}

function persons(cb){
  Person.findAll({isDeleted: {$ne: true}, 'tags': {$exists: true}}, {'tags': 1}, cb);
}
