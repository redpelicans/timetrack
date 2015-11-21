import React from 'react';
import ReactDOM from 'react-dom';
import  {Router, Route, Link, IndexRoute, IndexLink, Redirect} from 'react-router';
import { createHistory, createHashHistory } from 'history';
import App from './app';
import sitemap from './sitemap';
import {navActions} from './models/nav';
import {loginStore, loginActions} from './models/login';

navActions.replace.listen(path => {
  history.replaceState(null, path)
})

function onEnter(nextState, replaceState){
  console.log("===> ENTER ROUTE: " + this.topic)
  navActions.register(this);
  if(this.authRequired && !loginStore.isLoggedIn()) replaceState({nextPath: nextState.location.path}, sitemap.login.path); 
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
        onLeave={onLeave.bind(r)} 
        key={r.path} 
        path={r.path} 
        component={r.component}/>
    });
}

const defaultRoute = sitemap.defaultRoute;

const routes = (
  <Route path="/" component={App}>
  <IndexRoute component={defaultRoute.component} onEnter={onEnter.bind(defaultRoute)}/>
    {getRoutes(sitemap.routes)}
    <Route path="*" component={sitemap.notfound.component} />
  </Route>
);

const history = createHashHistory();
ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById("formo"));



