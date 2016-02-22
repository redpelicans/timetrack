import uuid from 'uuid'
import  should from "should"
import  _ from "lodash"
import Immutable from 'immutable'
import {createServer, configureStore} from '../helpers/server'
import {missionsActions, FILTER_MISSIONS, SORT_MISSIONS, MISSIONS_LOADED, MISSION_CREATED, MISSION_DELETED, MISSION_UPDATED} from '../../src/client/actions/missions'
import rootReducer from '../../src/client/reducers'
import {data} from './data/missions'
import {Mission} from '../../src/server/models'


describe('server and redux tests for missions', () => {
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

  it('Check load missions', function(done){
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {MISSIONS_LOADED: getState => {
      try{
        const state = getState()
        const source = _.map(data['collections']['missions'], mission => mission.name)
        const target = state.missions.data.toSetSeq().map(mission => mission.get('name')).toJS()
        should(source).be.eql(target)
        done()
      }catch(e){ done(e) }
    }})

    db.load(data, () => store.dispatch(missionsActions.load()))
  })

  it('Check create mission', (done) => {
    const newMission = data['collections']['missions'][0]
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {MISSION_CREATED: getState => {
      try{
        const state = getState()
        const mission = state.missions.data.toSetSeq().toJS()[0]
        should(newMission.name).be.eql(mission.name)
        done()
      }catch(e){ done(e) }
    }})

    store.dispatch(missionsActions.create(newMission))
  })

  it('Check update mission', (done) => {
    const newName = 'toto'
    let missionId
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {MISSION_UPDATED: getState => {
      try{
       const state = getState()
       const updatedMission = state.missions.data.get(missionId)
       should.exist(updatedMission)
       should(updatedMission.get('name')).be.eql(newName)
       done()
      }catch(e){ done(e) }
    }})

    db.load(data, () => {
      Mission.findOne({isDeleted: {$ne: true}}, (err, mission) => {
        if(err) return done(err)
        missionId = mission._id.toString()
        store.dispatch(missionsActions.load())
        store.dispatch(missionsActions.update(mission, {name: newName}))
      })
    })
  })

  it('Check delete mission', (done) => {
    let missionId
    const initialState = {}
    const store = configureStore( rootReducer, initialState, {MISSION_DELETED: getState => {
      try{
       const state = getState()
       const deletedMission = state.missions.data.get(missionId.toString())
       should.not.exist(deletedMission)
       Mission.findOne({isDeleted: true, _id: missionId}, (err, mission) => {
         if(err) return done(err)
         should.exist(mission)
         done()
       })
      }catch(e){ done(e) }
    }})

    db.load(data, () => {
      Mission.findOne({isDeleted: {$ne: true}}, (err, mission) => {
        if(err) return done(err)
        missionId = mission._id
        store.dispatch(missionsActions.load())
        store.dispatch(missionsActions.delete(mission))
      })
    })
  })

  it('Check filter missions', (done) => {
    const newName = uuid.v4()
    const initialState = {}
    const actions = {
      FILTER_MISSIONS: getState => {
        try{
         const state = getState()
         should(state.missions.filter).eql(newName);
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(missionsActions.filter(newName))

  })


  it('Check sort missions', (done) => {
    const initialState = { missions: {sortCond: {by: 'name', order: 'asc'}}}
    const actions = {
      SORT_MISSIONS: getState => {
        try{
         const state = getState()
         should(state.missions.sortCond.by).eql('date')
         should(state.missions.sortCond.order).eql('asc')
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(missionsActions.sort('date'))

  })


  it('Check re-sort missions', (done) => {
    const initialState = { missions: {sortCond: {by: 'name', order: 'asc'}}}
    const actions = {
      SORT_MISSIONS: getState => {
        try{
         const state = getState()
         should(state.missions.sortCond.by).eql('name')
         should(state.missions.sortCond.order).eql('desc')
         done()
        }catch(e){ done(e) }
      }
    }

    const store = configureStore( rootReducer, initialState, actions )
    store.dispatch(missionsActions.sort('name'))

  })
})
