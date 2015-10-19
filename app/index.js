import React from 'react'
import ReactDOM from 'react-dom'
import  {Router, Route, Link, IndexRoute, IndexLink, Redirect} from 'react-router'
import { createHistory, createHashHistory } from 'history';
import App from './app';
import HomeApp from './views/home';
import NotFound from './components/not-found';
import routeData from './routes';
import Nav from './models/nav.js';

function onEnter(route, nextState, replaceState){

  console.log("===> NEW ROUTE: " + route.topic)
  Nav.newTopic(route.topic);
}

function getRoutes(data){
  return data.map(r => <Route topic={r.topic} onEnter={onEnter.bind(null, r)} key={r.path} path={r.path} component={r.component}/>)
}

let routes = (
  <Route path="/" component={App}>
  <IndexRoute component={HomeApp}/>
    { getRoutes(routeData) }
    <Route path="*" component={NotFound} />
  </Route>
);


let history = createHashHistory();
ReactDOM.render(<Router history={history}>{routes}</Router>, document.body)



