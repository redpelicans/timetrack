import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link, IndexRoute, IndexLink, Redirect} from 'react-router';
import {createHistory, createHashHistory} from 'history';
import App from './app';
import {navActions} from './models/nav';
import errors from './models/errors';
import {loginStore, loginActions} from './models/login';
import authManager from './auths';
import sitemap from './routes';
import boot from './boot';
import {registerSocketIO}from './socketIO';

registerSocketIO();

navActions.goBackRoute.listen( ()=> {
  history.goBack();
})

navActions.replaceRoute.listen(nextRoute => {
  history.replaceState(null, nextRoute.path)
})

navActions.pushRoute.listen( (nextRoute, context) => {
  history.pushState(context, nextRoute.path)
})

function onEnter(nextState, replaceState){
  console.log("===> ENTER ROUTE: " + this.path)
  if(this.isAuthRequired() && !loginStore.isLoggedIn()) return replaceState({nextRouteName: this.fullName}, sitemap.login.path); 
  if(!authManager.isAuthorized(this)) return replaceState(null, sitemap.unauthorized.path); 
  navActions.enter(this);
}

function onLeave(location){
  console.log("===> LEAVE ROUTE: " + this.topic)
}

function getRoutes(sitemap){
  return sitemap.routes
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

const defaultRoute = sitemap.defaultRoute;

const routes = (
  <Route path="/" component={App}>
  <IndexRoute component={defaultRoute.component} onEnter={onEnter.bind(defaultRoute)}/>
    {getRoutes(sitemap)}
    <Route path="*" component={sitemap.notfound.component} />
  </Route>
);

const history = createHashHistory();

history.listen( location => {
  navActions.setContext(location.state);
});

boot().then( () => {
  console.log("End of boot process.")
  console.log("Rendering react App...")
  ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById("formo"));
})
// .catch( (err) => {
//   console.log(err)
//   const elt = document.getElementById("bootmessage");
//   elt.className="alert alert-danger boot-error";
//   elt.innerText = 'Runtime error, check your backend';
// });



