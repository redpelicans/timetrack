import async from 'async';
import _ from 'lodash';
import {Person, Company} from '../../models';

export function init(app){
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

  // TODO: check correct rights depending on entity
  app.post('/tags', checkRights('person.new'), function(req, res, next){
    const {type, entityId, tags} = req.body;
    const klass =  {Person: 'person', Company: 'company'}[type];
    if(!klass)return next(new Error(`Unknown type: ${type} to update tags`));
    async.waterfall([
      loadEntity.bind(null, entityId, klass),
      updateTags.bind(null, tags, klass),
      loadEntity.bind(null, entityId, klass),
    ], (err, entity){
      if(err)return next(err);
      res.json(entity);
    });
  })
}

function loadEntity(id, klass){
  klass.loadOne(id, (err, entity) => {
    if(err)return cb(err);
    if(!entity)cb(new Error("Unknown entity"));
    cb(null, entity);
  });
}

function updateTags(tags, klass, entity, cb){
  klass.collection.updateOne({_id: entity._id}, {$set: {tags}}, (err) => cb(err) );
}

function companies(cb){
  Company.findAll({isDeleted: {$ne: true}, 'tags': {$exists: true}}, {'tags': 1}, cb);
}

function persons(cb){
  Person.findAll({isDeleted: {$ne: true}, 'tags': {$exists: true}}, {'tags': 1}, cb);
}
