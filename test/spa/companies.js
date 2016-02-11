//assertion library
import  should from "should";
import  async from "async";
import  _ from "lodash";
import * as server from '../helpers/server';
import {companiesActions} from '../../app/actions/companies';

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../../app/reducers'

const store = createStore( rootReducer, {}, compose(applyMiddleware(thunk)));

describe('companies SPA', () => {
  // call once foreach  describe()
  before(cb => server.start(cb))

  // call once after each  describe()
  after( done => server.stop(done) )

  it('Check load companies', (cb) => {
    store.dispatch(companiesActions.load())
    cb();
  });

});
