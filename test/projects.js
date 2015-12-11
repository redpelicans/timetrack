//assertion library
import  should from "should";
import  async from "async";
import  _ from "lodash";
// model to test, tests are run directly from src
import {Project, Step}  from '../src/server/lib/models';
// help to connect, load data to MongoDB
import * as DB from './helpers/db';
// sample data to load
import {data}  from './data/projects';

describe('Project', () => {
  // call once foreach  describe()
  before(cb => DB.connect('tests', cb))

  // call foreach  it()
  beforeEach(done => {
    DB.drop( err => {
      if(err) done(err);
      DB.load(data, done);
    })
  })

  // call once after each  describe()
  after( done => DB.close(done) )

  // it() here is async
  it('Check projects data loading', (cb) => {
    Project.findAll({type: 'project'}, (err, projects) => {
      if(err) return cb(err);
      let count = _.filter(data['collections']['steps'], step => step.type === 'project').length;
      should(projects.length).equal(count);
      cb();
    });
  });

});
