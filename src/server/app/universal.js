import async from 'async';
import {Person} from '../models';
import React, {Component} from 'react';
import {renderToString} from 'react-dom/server';
import { createStore, applyMiddleware} from 'redux'                                                                                                                             
import thunk from 'redux-thunk'
import rootReducer from '../../client/reducers'
import {Route, IndexRoute, match, RouterContext} from 'react-router';
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import AuthManager from '../../client/components/authmanager'
import App from '../../client/containers/app';
import {loggedIn} from '../../client/actions/login';
import {sitemapActions} from '../../client/actions/sitemap';
import registerAuthManager from '../../client/auths';
import routesManager from '../../client/routes';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
momentLocalizer(moment);

const store = createStore( rootReducer, undefined, applyMiddleware(thunk));
const authManager = registerAuthManager(store);

function onEnter(nextState, replace){
  console.log("===> ENTER ROUTE: " + this.path)
  const state = store.getState();
  if(this.isAuthRequired() && !state.login.user) return replace(routesManager.login.path, null, {nextRouteName: this.fullName}); 
  if(!authManager.isAuthorized(this)) return replace(routesManager.unauthorized.path); 
  store.dispatch(sitemapActions.enter(this));
}

function onLeave(location){
  console.log("===> LEAVE ROUTE: " + this.topic)
}

function getRoutes(routes){
  return routes
    .filter(r => r.path)
    .map(r => {
      return <Route 
        topic={r.topic} 
        onEnter={onEnter.bind(r)} 
        //onLeave={onLeave.bind(r)} 
        key={r.path} 
        path={r.path} 
        component={r.component}/>
    });
}

const defaultRoute = routesManager.defaultRoute;

const routes = (
  <Route path="/" component={App}>
  <IndexRoute component={defaultRoute.component} onEnter={onEnter.bind(defaultRoute)}/>
    {getRoutes(routesManager.routes)}
    <Route path="*" component={routesManager.notfound.component} />
  </Route>
);

const Root = ({store, authManager, renderProps}) => {
  return (
    <Provider store={store}>
      <AuthManager manager={authManager}>
        <RouterContext {...renderProps} />
      </AuthManager>
    </Provider>
  )
}

function findUser(secretKey){
  return function(req, res, next) {
    const token = req.cookies.timetrackToken;
    if(!token)return next();
    Person.getFromToken(token, secretKey, (err, user) => {
      if(err){
        console.log(err);
        return res.status(401).send("Unauthorized access");
      }
      if(!user)return next();
      if(!user.hasSomeRoles(['admin', 'access']))  return res.status(401).send("Unauthorized access");
      req.user = user;
      next();
    })
  }
}

export function init(app, resources, params){
  app.get('*', findUser(params.secretKey), function(req, res){
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        const reactOutput = renderToString(React.createFactory(Root)({store, authManager, renderProps}));
        res.render('index.ejs', {reactOutput});
      } else {
        res.status(404).send('Not found')
      }
    });
  }); 
}
