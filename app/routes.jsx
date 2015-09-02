import React from 'react';
import Router from 'react-router';
import App from './app';
import Home from './components/home';
import NotFound from './components/not-found';
import Dummy1 from './components/dummy1';
import Dummy2 from './components/dummy2';

let appRoutesData = [
  {route: 'route1', label: 'route1', handler: Dummy1},
  {route: 'route2', label: 'route2', handler: Dummy2}
];

let routes = (
  <Router.Route path="/" handler={App}>
    <Router.DefaultRoute handler={Home}/>
    <Router.NotFoundRoute handler={NotFound} />
    {appRoutesData.map((routeData) => {
      return (
        <Router.Route
          key={routeData.route}
          path={routeData.route}
          name={routeData.route}
          handler={routeData.handler}
        />
      );
    })}
  </Router.Route>
);

export default routes;
export {appRoutesData};
