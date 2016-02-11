//assertion library
import  should from "should"
import  _ from "lodash"
import * as server from '../helpers/server'
import {companiesActions} from '../../app/actions/companies'
import {data} from './data/companies'

let STORE, SERVER, DB

describe('server and redux tests for companies', () => {
  // call once foreach  describe()
  before(cb => server.start( (err, {server, db}) => {
    if(err)return cb(err)
    SERVER = server
    DB = db
    cb()
  }))

  // call foreach  it()
  beforeEach(done =>  {
    DB.drop( () => {
      STORE = SERVER.getStore()
      done()
    }) 
  })

  // call once after each  describe()
  after( done => SERVER.stop(done) )

  it('Check load companies', function(done){
    STORE.subscribe( () => {
      const state = STORE.getState()
      if(state.companies.data.size){
        const source = _.map(data['collections']['companies'], company => company.name)
        const target = state.companies.data.toSetSeq().map(company => company.get('name')).toJS()
        should(source).be.eql(target)
        done()
      }
    })
    DB.load(data, () => STORE.dispatch(companiesActions.load()))
  })

  it('Check create company', (done) => {
    const newCompany = data['collections']['companies'][0]
    STORE.subscribe( () => {
      const state = STORE.getState()
      if(state.companies.data.size){
        const company = state.companies.data.toSetSeq().toJS()[0]
        should(newCompany.name).be.eql(company.name)
        done()
      }
    })
    STORE.dispatch(companiesActions.create(newCompany))
  })

  it('Check update company', (done) => {
    const newName = 'toto'
    const unsubscribe1 = STORE.subscribe( () => {
      const state = STORE.getState()
      if(state.companies.data.size){
       const previousCompany = state.companies.data.toSetSeq().toJS()[0]
       const unsubscribe2 = STORE.subscribe( () => {
         const state = STORE.getState()
         const updatedCompany = state.companies.data.filter(company => company.get('name') === newName)
         if(updatedCompany){
           unsubscribe2()
           done()
         }
       })
       unsubscribe1()
       STORE.dispatch(companiesActions.update({_id: previousCompany._id}, {name: newName}))
      }
    })

    DB.load(data, () => {
      STORE.dispatch(companiesActions.load())
    })
  })

  it('Check delete company', (done) => {
    const unsubscribe1 = STORE.subscribe( () => {
      const state1 = STORE.getState()
      if(state1.companies.data.size){
       const deletedCompany = state1.companies.data.toSetSeq().toJS()[0]
       STORE.subscribe( () => {
         const state2 = STORE.getState()
         if(state2.companies.data.size == state1.companies.data.size - 1) done()
       })
       unsubscribe1()
       STORE.dispatch(companiesActions.delete(deletedCompany))
      }
    })

    DB.load(data, () => {
      STORE.dispatch(companiesActions.load())
    })
  })
})
