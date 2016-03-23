import React from 'react';
import {render} from 'react-dom';
import {Route, IndexRoute, browserHistory as history } from 'react-router';
import Root from './containers/root';
import App from './containers/app';
import {logUser} from './actions/login';
import {sitemapActions} from './actions/sitemap';
import registerAuthManager from './auths';
import routesManager from './routes';
import boot from './boot';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
momentLocalizer(moment);
import configureStore from './store/configureStore';

const store = configureStore();
const authManager = registerAuthManager(store);

import 'react-widgets/lib/less/react-widgets.less';
import '../../public/styles/app.less';

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

boot().then( user => {
  console.log("End of boot process.")
  console.log("Rendering react App...")
  if(user) store.dispatch(logUser(user));
  render(<Root store={store} routes={routes} history={history} authManager={authManager}/>, document.getElementById("timetrackApp"));
})
.catch( (err) => {
  console.log("====>>>> " + err)
});



