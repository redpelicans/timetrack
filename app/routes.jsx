import NotFound from './components/not-found';
import CompanyListApp from './components/company/list';
import CompanyAddApp from './components/addCompany/app';
import MissionApp from './components/mission/app';
import TimesheetApp from './components/timesheet/app';


let routeData = [
  {path: 'Companies', label: 'Companies', component: CompanyListApp, isMenu: true, iconName: 'business'},
  {path: 'AddCompany', label: 'AddCompany', component: CompanyAddApp},
  {path: 'Timesheet', label: 'Timesheet', component: TimesheetApp, isMenu: true, iconName: 'access_time'},
  {path: 'Missions', label: 'Missions', component: MissionApp, isMenu: true, iconName: 'thumb_up'},
  {path: 'Invoices', label: 'Invoices', component: NotFound, isMenu: true, iconName: 'shopping_cart'},
  {path: 'Stats', label: 'Stats', component: NotFound, isMenu: true, iconName: 'dashboard'},
  {path: 'People', label: 'People', component: NotFound, isMenu: true, iconName: 'people'},
  {path: 'MarketPlace', label: 'MarketPlace', component: NotFound, isMenu: true, iconName: 'language'},
];

export default routeData;
