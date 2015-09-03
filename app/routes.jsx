import React from 'react';
import Router from 'react-router';
import App from './app';
import Home from './components/home';
import NotFound from './components/not-found';
import {ClientApp} from './components/client';
import {TimesheetApp} from './components/timesheet';

let appRoutesData = [
  {route: 'Client', label: 'Client', handler: ClientApp},
  {route: 'Timesheet', label: 'Timesheet', handler: TimesheetApp}
];

let routes = (
  <Router.Route path="/" handler={App}>
    <Router.DefaultRoute handler={Home}/>
    <Router.NotFoundRoute handler={NotFound} />
    {appRoutesData.map(routeData => {
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
