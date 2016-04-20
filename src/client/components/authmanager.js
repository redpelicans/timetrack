import React, { Component, PropTypes, Children } from 'react'

export default class AuthManager extends Component{
  getChildContext() {
    return { 
      authManager: this.manager,
      dispatch: this.dispatch,
    }
  }

  constructor(props, context) {
    super(props, context)
    this.manager = props.manager;
    this.dispatch = context.store.dispatch;
  }

  render(){
    let { children } = this.props
    return Children.only(children)
  }
}

AuthManager.childContextTypes = {
  authManager: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

AuthManager.propTypes = {
  manager: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired
}

AuthManager.contextTypes = { 
  store: PropTypes.object
}


export const authable = (Component) => {
  Component.contextTypes = { 
    ...Component.contextTypes,
    authManager: PropTypes.object,
    dispatch: PropTypes.func
  }

  return (props) =>  <Component {...props} />;
}

