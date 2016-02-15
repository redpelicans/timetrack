//assertion library
import uuid from 'uuid'
import  should from "should"
import  _ from "lodash"
import Immutable from 'immutable'
import {createServer, configureStore} from '../helpers/server'
import {companiesActions, FILTER_COMPANIES, UPDATE_TAGS_COMPLETED, TOGGLE_PREFERRED_FILTER, COMPANY_TOGGLE_PREFERRED_COMPLETED, COMPANIES_LOADED, COMPANY_CREATED, COMPANY_DELETED, COMPANY_UPDATED} from '../../app/actions/companies'
import companiesReducer from '../../app/reducers/companies'
import rootReducer from '../../app/reducers'
import {data} from './data/companies'
import {Company} from '../../server/src/models'


describe('server and redux tests for companies', () => {
  let server, db
  // call once foreach  describe()
  before(cb => createServer( (err, data) => {
    if(err)return cb(err)
    server = data.server
    db = data.db
    cb()
  }))

  // call foreach  it()
  beforeEach(done => db.drop( done ) )

  // call once after each  describe()
  after( done => server.stop(done) )

  it('Check load companies', function(done){
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {COMPANIES_LOADED: getState => {
      try{
        const state = getState()
        const source = _.map(data['collections']['companies'], company => company.name)
        const target = state.companies.data.toSetSeq().map(company => company.get('name')).toJS()
        should(source).be.eql(target)
        done()
      }catch(e){ done(e) }
    }})

    db.load(data, () => store.dispatch(companiesActions.load()))
  })

  it('Check create company', (done) => {
    const newCompany = data['collections']['companies'][0]
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {COMPANY_CREATED: getState => {
      try{
        const state = getState()
        const company = state.companies.data.toSetSeq().toJS()[0]
        should(newCompany.name).be.eql(company.name)
        done()
      }catch(e){ done(e) }
    }})

    store.dispatch(companiesActions.create(newCompany))
  })

  it('Check update company', (done) => {
    const newName = 'toto'
    let companyId
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {COMPANY_UPDATED: getState => {
      try{
       const state = getState()
       const updatedCompany = state.companies.data.get(companyId)
       should.exist(updatedCompany)
       should(updatedCompany.get('name')).be.eql(newName)
       done()
      }catch(e){ done(e) }
    }})

    db.load(data, () => {
      Company.findOne({isDeleted: {$ne: true}}, (err, company) => {
        if(err) return done(err)
        companyId = company._id.toString()
        store.dispatch(companiesActions.load())
        store.dispatch(companiesActions.update(company, {name: newName}))
      })
    })
  })

  it('Check delete company', (done) => {
    let companyId
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {COMPANY_DELETED: getState => {
      try{
       const state = getState()
       const deletedCompany = state.companies.data.get(companyId.toString())
       should.not.exist(deletedCompany)
       Company.findOne({isDeleted: true, _id: companyId}, (err, company) => {
         if(err) return done(err)
         should.exist(company)
         done()
       })
      }catch(e){ done(e) }
    }})

    db.load(data, () => {
      Company.findOne({isDeleted: {$ne: true}}, (err, company) => {
        if(err) return done(err)
        companyId = company._id
        store.dispatch(companiesActions.load())
        store.dispatch(companiesActions.delete(company))
      })
    })
  })

  it('Check toggle preferred', (done) => {
    let companytoBeUpdated
    const initialState = {}
    const actions = {
      COMPANIES_LOADED: () => {
        store.dispatch(companiesActions.togglePreferred(companytoBeUpdated))
      },
      COMPANY_TOGGLE_PREFERRED_COMPLETED: getState => {
        try{
         const state = getState()
         const updatedCompany = state.companies.data.get(companytoBeUpdated._id.toString())
         should.exist(updatedCompany)
         should(updatedCompany.get('preferred')).be.true
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )

    db.load(data, () => {
      Company.findOne({isDeleted: {$ne: true}}, (err, company) => {
        if(err) return done(err)
        store.dispatch(companiesActions.load())
        companytoBeUpdated = company
      })
    })
  })

  it('Check update tags preferred', (done) => {
    let companytoBeUpdated
    const initialState = {}
    const tags = ['toto', 'titi']
    const actions = {
      COMPANIES_LOADED: () => {
        store.dispatch(companiesActions.updateTags(companytoBeUpdated, tags))
      },
      UPDATE_TAGS_COMPLETED: getState => {
        try{
         const state = getState()
         const updatedCompany = state.companies.data.get(companytoBeUpdated._id.toString())
         should.exist(updatedCompany)
         should(updatedCompany.get('tags').toJS()).eql(tags);
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )

    db.load(data, () => {
      Company.findOne({isDeleted: {$ne: true}}, (err, company) => {
        if(err) return done(err)
        store.dispatch(companiesActions.load())
        companytoBeUpdated = company
      })
    })
  })

  it('Check filter companies', (done) => {
    const newName = uuid.v4()
    const initialState = {}
    const actions = {
      FILTER_COMPANIES: getState => {
        try{
         const state = getState()
         should(state.companies.filter).eql(newName);
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(companiesActions.filter(newName))

  })

  it('Check filter preferred companies', (done) => {
    const initialState = { companies: {filterPreferred: false}}
    const actions = {
      TOGGLE_PREFERRED_FILTER: getState => {
        try{
         const state = getState()
         should(state.companies.filterPreferred).be.true
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(companiesActions.togglePreferredFilter())
  })

  it('Check unfilter preferred companies', (done) => {
    const initialState = { companies: {filterPreferred: true}}
    const actions = {
      TOGGLE_PREFERRED_FILTER: getState => {
        try{
         const state = getState()
         should(state.companies.filterPreferred).be.false
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(companiesActions.togglePreferredFilter())
  })


  it('Check sort companies', (done) => {
    const initialState = { companies: {sortCond: {by: 'name', order: 'asc'}}}
    const actions = {
      SORT_COMPANIES: getState => {
        try{
         const state = getState()
         should(state.companies.sortCond.by).eql('date')
         should(state.companies.sortCond.order).eql('asc')
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(companiesActions.sort('date'))

  })


  it('Check re-sort companies', (done) => {
    const initialState = { companies: {sortCond: {by: 'name', order: 'asc'}}}
    const actions = {
      SORT_COMPANIES: getState => {
        try{
         const state = getState()
         should(state.companies.sortCond.by).eql('name')
         should(state.companies.sortCond.order).eql('desc')
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(companiesActions.sort('name'))

  })




})
