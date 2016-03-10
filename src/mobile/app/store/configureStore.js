import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import companies from '../companies'

const rootReducer = combineReducers({
  companies,
})

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, applyMiddleware(thunk))
}
