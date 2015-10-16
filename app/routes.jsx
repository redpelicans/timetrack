import NotFound from './components/not-found';
import CompanyListApp from './views/company/list';
import NewCompanyApp from './components/newCompany/app';
import MissionApp from './components/mission/app';
import TimesheetApp from './components/timesheet/app';
import HomeApp from './views/home';


let routeData = [
  {path: '/home', topic:'home', label: 'Home', component: HomeApp, isMenu: true, iconName: 'home'},
  {path: '/companies', topic:'companies', label: 'Companies', component: CompanyListApp, isMenu: true, iconName: 'business'},
  {path: '/company/new', topic:'companies', component: NewCompanyApp},
  {path: '/timesheet', topic:'timesheet', label: 'Timesheet', component: TimesheetApp, isMenu: true, iconName: 'access_time'},
  {path: '/missions', topic:'missions', label: 'Missions', component: MissionApp, isMenu: true, iconName: 'thumb_up'},
  {path: '/invoices', topic:'invoices', label: 'Invoices', component: NotFound, isMenu: true, iconName: 'shopping_cart'},
  {path: '/stats', topic:'stats', label: 'Stats', component: NotFound, isMenu: true, iconName: 'dashboard'},
  {path: '/people', topic:'people', label: 'People', component: NotFound, isMenu: true, iconName: 'people'},
  {path: '/marketplace', topic:'marketplace', label: 'MarketPlace', component: NotFound, isMenu: true, iconName: 'language'},
];

export default routeData;
