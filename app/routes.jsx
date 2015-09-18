import React from 'react';
import Router from 'react-router';
import App from './app';
import Home from './components/home';
import NotFound from './components/not-found';
import CompanyListApp from './components/company/list';
import CompanyAddApp from './components/company/add';
import MissionApp from './components/mission/app';
import TimesheetApp from './components/timesheet/app';

let appRoutesData = [
  {route: 'Companies', label: 'Companies', handler: CompanyListApp, isMenu: true, iconName: 'business'},
  {route: 'AddCompany', label: 'AddCompany', handler: CompanyAddApp},
  {route: 'Timesheet', label: 'Timesheet', handler: TimesheetApp, isMenu: true, iconName: 'access_time'},
  {route: 'Missions', label: 'Missions', handler: MissionApp, isMenu: true, iconName: 'thumb_up'},
  {route: 'Invoices', label: 'Invoices', handler: NotFound, isMenu: true, iconName: 'shopping_cart'},
  {route: 'Stats', label: 'Stats', handler: NotFound, isMenu: true, iconName: 'dashboard'},
  {route: 'People', label: 'People', handler: NotFound, isMenu: true, iconName: 'people'},
  {route: 'MarketPlace', label: 'MarketPlace', handler: NotFound, isMenu: true, iconName: 'language'},
];


let routes = (
  <Router.Route path="/" handler={App}>
    <Router.DefaultRoute handler={Home}/>
    <Router.NotFoundRoute handler={NotFound} />
    {
      appRoutesData.map(routeData => {
        return (
          <Router.Route
            key={routeData.route}
            path={routeData.route}
            name={routeData.route}
            handler={routeData.handler}
          />
        );
      })
    }
  </Router.Route>
);

export default routes;
export {appRoutesData};
