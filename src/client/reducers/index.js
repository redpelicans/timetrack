import { combineReducers } from 'redux'
import { routeReducer as routing} from 'react-router-redux'
import login from './login'
import error from './errors'
import socketIO from './socketIO'
import sitemap from './sitemap'
import companies from './companies'
import persons from './persons'
import missions from './missions'
import pendingRequests from './loading'
import cities from './cities'
import countries from './countries'
import tags from './tags'
import notes from './notes'
import skills from './skills'
import events from './events'
import agenda from './agenda'

const rootReducer = combineReducers({
    routing
  , login
  , socketIO
  , error 
  , sitemap
  , companies
  , persons
  , missions
  , cities
  , countries
  , tags
  , notes
  , skills
  , agenda
  , events
  , pendingRequests
})

export default rootReducer;
