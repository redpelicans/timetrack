//assertion library
import  should from "should"
import  _ from "lodash"
import * as server from '../helpers/server'
import {companiesActions} from '../../app/actions/companies'

let STORE, SERVER;

describe('companies SPA', () => {
  // call once foreach  describe()
  before(cb => server.start( (err, server, store) => {
    if(err)return cb(err);
    STORE = store;
    SERVER = server;
    cb();
  }))

  // call once after each  describe()
  after( done => SERVER.stop(done) )

  it('Check load companies', (cb) => {
    STORE.dispatch(companiesActions.load())
    cb()
  })

})
