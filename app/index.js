import React from 'react'
import ReactDOM from 'react-dom'
import  {Router, Route, Link, IndexRoute, IndexLink, Redirect} from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory';
import App from './app';
import HomeApp from './components/home/app';
import NotFound from './components/not-found';
import routeData from './routes';
import Nav from './models/nav.js';

function onEnter(route, nextState, replaceState){
  Nav.newTopic(route.topic);
}

// to be removed
function getRoutes(data){
  return data.map(r => {
    return <Route topic={r.topic} onEnter={onEnter.bind(null, r)} key={r.path} path={r.path} component={r.component}/>
  })
}

let routes = (
  <Route path="/" component={App}>
  <IndexRoute component={HomeApp}/>
    { getRoutes(routeData) }
    <Route path="*" component={NotFound} />
  </Route>
);


let history = createBrowserHistory();
ReactDOM.render(<Router history={history}>{routes}</Router>, document.body)



