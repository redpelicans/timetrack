import uuid from 'uuid'
import  should from "should"
import  _ from "lodash"
import Immutable from 'immutable'
import {createServer, configureStore} from '../helpers/server'
import {personsActions, FILTER_PERSONS, PERSON_UPDATE_TAGS_COMPLETED, TOGGLE_PREFERRED_FILTER, PERSON_TOGGLE_PREFERRED_COMPLETED, PERSONS_LOADED, PERSON_CREATED, PERSON_DELETED, PERSON_UPDATED} from '../../src/client/actions/persons'
import rootReducer from '../../src/client/reducers'
import {data} from './data/persons'
import {Person} from '../../src/server/models'

const convertPerson = x => {
  return {
    email:      x.email,
    firstName:  x.firstName,
    lastName:   x.lastName,
    type:       x.type
  }
}

const convertImmutablePerson = x => {
  return {
    email:      x.get('email'),
    firstName:  x.get('firstName'),
    lastName:   x.get('lastName'),
    type:       x.get('type')
  }
}

describe('server and redux tests for persons', () => {
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

  it('Check load persons', function(done){
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {PERSONS_LOADED: getState => {
      try{
        const state = getState()
        const source = _.map(data['collections']['persons'], convertPerson)
        const target = state.persons.data.toSetSeq().map(convertImmutablePerson).toJS()
        should(source).be.eql(target)
        done()
      }catch(e){ done(e) }
    }})

    db.load(data, () => store.dispatch(personsActions.load()))
  })

  it('Check create person', (done) => {
    const newPerson = convertPerson(data['collections']['persons'][0])
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {PERSON_CREATED: getState => {
      try{
        const state = getState()
        const person = convertPerson(state.persons.data.toSetSeq().toJS()[0])
        should(newPerson).be.eql(person)
        done()
      }catch(e){ done(e) }
    }})

    store.dispatch(personsActions.create(newPerson))
  })

  it('Check update person', (done) => {
    const newFirstName = 'hello'
    const newLastName = 'world'
    let personId
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {PERSON_UPDATED: getState => {
      try{
       const state = getState()
       const updatedPerson = state.persons.data.get(personId)
       should.exist(updatedPerson)
       should(updatedPerson.get('firstName')).be.eql(newFirstName)
       should(updatedPerson.get('lastName')).be.eql(newLastName)
       done()
      }catch(e){ done(e) }
    }})

    db.load(data, () => {
      Person.findOne({isDeleted: {$ne: true}}, (err, person) => {
        if(err) return done(err)
        personId = person._id.toString()
        store.dispatch(personsActions.load())
        store.dispatch(personsActions.update(person, {firstName: newFirstName, lastName: newLastName}))
      })
    })
  })

  it('Check delete person', (done) => {
    let personId
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {PERSON_DELETED: getState => {
      try{
       const state = getState()
       const deletedPerson = state.persons.data.get(personId.toString())
       should.not.exist(deletedPerson)
       Person.findOne({isDeleted: true, _id: personId}, (err, person) => {
         if(err) return done(err)
         should.exist(person)
         done()
       })
      }catch(e){ done(e) }
    }})

    db.load(data, () => {
      Person.findOne({isDeleted: {$ne: true}}, (err, person) => {
        if(err) return done(err)
        personId = person._id
        store.dispatch(personsActions.load())
        store.dispatch(personsActions.delete(person))
      })
    })
  })

  it('Check toggle preferred', (done) => {
    let personToBeUpdated
    const initialState = {}
    const actions = {
      PERSONS_LOADED: () => {
        store.dispatch(personsActions.togglePreferred(personToBeUpdated))
      },
      PERSON_TOGGLE_PREFERRED_COMPLETED: getState => {
        try{
         const state = getState()
         const updatedPerson = state.persons.data.get(personToBeUpdated._id.toString())
         should.exist(updatedPerson)
         should(updatedPerson.get('preferred')).be.true
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )

    db.load(data, () => {
      Person.findOne({isDeleted: {$ne: true}}, (err, person) => {
        if(err) return done(err)
        store.dispatch(personsActions.load())
        personToBeUpdated = person
      })
    })
  })

  it('Check update tags preferred', (done) => {
    let personToBeUpdated
    const initialState = {}
    const tags = ['toto', 'titi']
    const actions = {
      PERSONS_LOADED: () => {
        store.dispatch(personsActions.updateTags(personToBeUpdated, tags))
      },
      PERSON_UPDATE_TAGS_COMPLETED: getState => {
        try{
         const state = getState()
         const updatedPerson = state.persons.data.get(personToBeUpdated._id.toString())
         should.exist(updatedPerson)
         should(updatedPerson.get('tags').toJS()).eql(tags);
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )

    db.load(data, () => {
      Person.findOne({isDeleted: {$ne: true}}, (err, person) => {
        if(err) return done(err)
        store.dispatch(personsActions.load())
        personToBeUpdated = person
      })
    })
  })

  it('Check filter persons', (done) => {
    const newName = uuid.v4()
    const initialState = {}
    const actions = {
      FILTER_PERSONS: getState => {
        try{
         const state = getState()
         should(state.persons.filter).eql(newName);
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(personsActions.filter(newName))

  })

  it('Check filter preferred persons', (done) => {
    const initialState = { persons: {filterPreferred: false}}
    const actions = {
      TOGGLE_PREFERRED_FILTER: getState => {
        try{
         const state = getState()
         should(state.persons.filterPreferred).be.true
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(personsActions.togglePreferredFilter())
  })

  it('Check unfilter preferred persons', (done) => {
    const initialState = { persons: {filterPreferred: true}}
    const actions = {
      TOGGLE_PREFERRED_FILTER: getState => {
        try{
         const state = getState()
         should(state.persons.filterPreferred).be.false
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(personsActions.togglePreferredFilter())
  })


  it('Check sort persons', (done) => {
    const initialState = { persons: {sortCond: {by: 'name', order: 'asc'}}}
    const actions = {
      SORT_PERSONS: getState => {
        try{
         const state = getState()
         should(state.persons.sortCond.by).eql('date')
         should(state.persons.sortCond.order).eql('asc')
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(personsActions.sort('date'))

  })

  it('Check re-sort persons', (done) => {
    const initialState = { persons: {sortCond: {by: 'name', order: 'asc'}}}
    const actions = {
      SORT_PERSONS: getState => {
        try{
         const state = getState()
         should(state.persons.sortCond.by).eql('name')
         should(state.persons.sortCond.order).eql('desc')
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(personsActions.sort('name'))

  })

})
