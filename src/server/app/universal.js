import async from 'async';
import _ from 'lodash';
import Immutable from 'immutable';
import uuid from 'uuid';
import {Person} from '../models';
import React, {Component} from 'react';
import {renderToString} from 'react-dom/server';
import { createStore, applyMiddleware} from 'redux'                                                                                                                             
import thunk from 'redux-thunk'
import {requestJson} from '../../client/utils';
import rootReducer from '../../client/reducers'
import companiesReducer from '../../client/reducers/companies'
import {Route, IndexRoute, match, RouterContext, Redirect} from 'react-router';
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import AuthManager from '../../client/components/authmanager'
import App from '../../client/containers/app';
import {loggedIn} from '../../client/actions/login';
import {sitemapActions} from '../../client/actions/sitemap';
import {companiesLoaded} from '../../client/actions/companies';
import registerAuthManager from '../../client/auths';
import routesManager from '../../client/routes';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
momentLocalizer(moment);
import debug from 'debug';
const logerror = debug('timetrack:error')
  , loginfo = debug('timetrack:info');

function loadCompanies(token){
  return requestJson('/api/companies', {token, message: 'Cannot isoload companies, check your backend server'})
}

function configureStore(user, token, cb){
  let initialState = {};
  if(!user) return setImmediate(cb, null, createStore(rootReducer, initialState, applyMiddleware(thunk)));
  user.name = user.fullName(); // TODO: move it server side
  initialState = rootReducer(initialState, loggedIn(JSON.parse(JSON.stringify(user)), token));
  const getState = () => initialState;
  loadCompanies(token)
    .then(companies => {
      initialState = rootReducer(initialState, companiesLoaded(companies));
      const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
      cb(null, store, companies);
    })
    .catch(cb);
}

function configureRoutes(store, authManager){

  function onEnter(nextState, replace){
    loginfo("===> ENTER ROUTE: " + this.path)
    const state = store.getState();
    if(this.isAuthRequired() && !state.login.user) return replace(routesManager.login.path, null, {nextRouteName: this.fullName}); 
    if(!authManager.isAuthorized(this)) return replace(routesManager.unauthorized.path); 
    store.dispatch(sitemapActions.enter(this));
  }

  const defaultRoute = routesManager.defaultRoute;
  const loginRoute = routesManager.login;

  const routes = (
    <Route path="/" component={App}>
      <IndexRoute component={defaultRoute.component} onEnter={onEnter.bind(defaultRoute)}/>
      <Route topic={defaultRoute.topic} onEnter={onEnter.bind(defaultRoute)} key={defaultRoute.path} path={defaultRoute.path} component={defaultRoute.component}/>
      <Route topic={loginRoute.topic} onEnter={onEnter.bind(loginRoute)} key={loginRoute.path} path={loginRoute.path} component={loginRoute.component}/>
      <Redirect from="*" to={defaultRoute.path} />
    </Route>
  );

  return routes;
}

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
        //console.log(`Person.getFromToken: ${err.toString()}`);
        return res.status(401).send("Unauthorized access");
      }
      if(!user)return next();
      if(!user.hasSomeRoles(['admin', 'access']))  return res.status(401).send("Unauthorized access");
      req.user = user;
      req.token = token;
      next();
    })
  }
}

export function init(app, resources, params){
  global.window = { location: { origin: params.server.url } };
  app.get('*', findUser(params.secretKey), function(req, res){
    loginfo(req.user ? `Isomorphic login of user '${req.user.fullName()}'` : 'Isomorphic login of an unknown user'); 
    configureStore(req.user, req.token, (err, store, companies) => {
      if (err){
        logerror(err.stack);
        return res.status(500)
      }

      const authManager = registerAuthManager(store);
      const routes = configureRoutes(store, authManager);
      match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (error) {
          logerror(error);
          logerror(error.stack);
          res.status(500)
        } else if (redirectLocation) {
          res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
          const reactOutput = renderToString(React.createFactory(Root)({store, authManager, renderProps}));
          const reactInitData = companies ? `timetrackInitCompanies = ${JSON.stringify(companies)}` : "";
          res.render('index.ejs', {reactOutput, reactInitData});
        } else {
          res.status(404).send('Not found')
        }
      })
    })
  }); 
}
