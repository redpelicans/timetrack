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
import {missionsLoaded} from '../../client/actions/missions';
import {personsLoaded} from '../../client/actions/persons';
import registerAuthManager from '../../client/auths';
import routesManager from '../../client/routes';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
momentLocalizer(moment);
import debug from 'debug';
const logerror = debug('timetrack:error')
  , loginfo = debug('timetrack:info');

const initialLoads = [
  {
    action: companiesLoaded,
    stub: 'companiesStub',
    request: token => requestJson('/api/companies', {token, message: 'Cannot isoload companies, check your backend server'}),
  },
  {
    action: missionsLoaded,
    stub: 'missionsStub',
    request: token => requestJson('/api/missions', {token, message: 'Cannot isoload missions, check your backend server'}),
  },
  {
    action: personsLoaded,
    stub: 'peopleStub',
    request: token => requestJson('/api/people', {token, message: 'Cannot isoload people, check your backend server'})
  },
]


function configureStore(user, token, cb){
  let initialState = {};
  if(!user) return setImmediate(cb, null, createStore(rootReducer, initialState, applyMiddleware(thunk)));
  user.name = user.fullName(); 
  initialState = rootReducer(initialState, loggedIn(JSON.parse(JSON.stringify(user)), undefined, {appJwt: token, forceCookie: true}));
  const getState = () => initialState;
  Promise.all(initialLoads.map( x => x.request(token)))
    .then((loads) => {
      loads.forEach((data, idx) => initialLoads[idx].data = data)
      const state = initialLoads.reduce( (state, load) => rootReducer(state, load.action(load.data)), initialState);
      const store = createStore(rootReducer, state, applyMiddleware(thunk));
      cb(null, store, initialLoads);
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
  const getRoutes = (routes) => {
    return routes
      .filter(r => r.path)
      .map(r => {
        return <Route 
          topic={r.topic} 
          onEnter={onEnter.bind(r)} 
          key={r.path} 
          path={r.path} 
          component={r.component}/>
      })
  }

  const routes = (
    <Route path="/" component={App}>
      <IndexRoute component={defaultRoute.component} onEnter={onEnter.bind(defaultRoute)}/>
      {getRoutes(routesManager.routes)}
      {/*
          <Route topic={defaultRoute.topic} onEnter={onEnter.bind(defaultRoute)} key={defaultRoute.path} path={defaultRoute.path} component={defaultRoute.component}/>
          <Route topic={loginRoute.topic} onEnter={onEnter.bind(loginRoute)} key={loginRoute.path} path={loginRoute.path} component={loginRoute.component}/>
      */}
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
  global.navigator = {userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2454.85 Safari/537.36'};
  app.get('*', findUser(params.secretKey), function(req, res){
    loginfo(req.user ? `Isomorphic login of user '${req.user.fullName()}'` : 'Isomorphic login of an unknown user'); 
    configureStore(req.user, req.token, (err, store, initialLoads) => {
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
          const data = {reactOutput};
          initialLoads.forEach(load => data[load.stub] = load.data ? `${load.stub} = ${JSON.stringify(load.data)}` : "")
          loginfo("End of universal rendering")
          res.render('index.ejs', data);
        } else {
          res.status(404).send('Not found')
        }
      })
    })
  }); 
}
