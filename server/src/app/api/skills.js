import async from 'async';
import _ from 'lodash';
import {Person} from '../../models';
import {ObjectId} from '../../helpers';

const baseSkills = [
  "AngularJS",
  "React",
  "D3",
  "Backbone",
  "Bootstrap",
  "JQuery",
  "KnockOut",
  "NodeJS",
  "MongoDB",
  "Docker",
];

export function init(app){
  app.get('/skills', function(req, res, next){
    async.waterfall([load], (err, skills) => {
      if(err)return next(err);
      const hbaseSkills = _.reduce(baseSkills, (res, skill) => {res[skill] = skill; return res}, {});
      const allSkills = _.merge(hbaseSkills, skills);
      res.json(_.values(allSkills).sort());
    })
  });
}


function load(cb){
  Person.findAll({isDeleted: {$ne: true}}, {skills: 1}, (err, persons) => {
    if(err)return next(err);
    const hallSkills = {};
    for(let person of persons){
      for(let skill of person.skills || []){
        hallSkills[skill] = skill;
      }
    }
    cb(null, hallSkills);
  });
}
