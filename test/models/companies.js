//assertion library
import  should from "should";
import  async from "async";
import  _ from "lodash";
import {Client} from '../../src/server/models';
// help to connect, load data to MongoDB
import * as DB from '../helpers/db';
// sample data to load
import {data} from './data/clients';

describe('Client', () => {
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
  it('Check clients data loading', (done) => {
    Client.findAll({type: 'client'}, (err, clients) => {
      if(err) return done(err);
      let count = _.filter(data['collections']['companies'], client => client.type === 'client').length;
      should(clients.length).equal(count);
      done();
    });
  });

});
