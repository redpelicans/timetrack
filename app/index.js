import React from 'react'
import ReactDOM from 'react-dom'
import  {Router, Route, Link, IndexRoute} from 'react-router'
import App from './app';
import Home from './components/home';
import NotFound from './components/not-found';
import routeData from './routes';


let routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    {
      routeData.map(r => {
        return  <Route key={r.path} path={r.path} component={r.component}/>;
      })
    }
    <Route path="*" component={NotFound} />
  </Route>
);


ReactDOM.render(<Router>{routes}</Router>, document.body)



