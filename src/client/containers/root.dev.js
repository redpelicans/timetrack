import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import DevTools from './dev-tools'
import { Router } from 'react-router'
import AuthManager from '../components/authmanager'

export default class Root extends Component {
  render() {
    const { store, routes, history, authManager } = this.props
    return (
      <Provider store={store}>
        <AuthManager manager={authManager}>
          <div>
          <Router history={history} routes={routes} />
            <DevTools />
          </div>
        </AuthManager>
      </Provider>
    )
  }
}

Root.propTypes = {
  store:        PropTypes.object.isRequired,
  routes:       PropTypes.object.isRequired,
  history:      PropTypes.object,
  authManager:  PropTypes.object.isRequired,
}
