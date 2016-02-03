import { combineReducers } from 'redux'
import { routeReducer as routing} from 'react-router-redux'
import login from './login'
import error from './errors'
import socketIO from './socketIO'
import sitemap from './sitemap'
import companies from './companies'
import pendingRequests from './loading'

const rootReducer = combineReducers({
    routing
  , login
  , socketIO
  , error 
  , sitemap
  , companies
  , pendingRequests
})

export default rootReducer;
