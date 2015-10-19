import NotFound from './components/not-found';
import CompanyListApp from './views/company/list';
import NewCompanyApp from './components/newCompany/app';
import MissionApp from './components/mission/app';
import TimesheetApp from './components/timesheet/app';
import HomeApp from './views/home';


let routeData = [
  {path: '/home', topic:'home', label: 'Home', component: HomeApp, isMenu: false, iconName: 'home'},
  {path: '/companies', topic:'companies', label: 'Companies', component: CompanyListApp, isMenu: true, iconName: 'building'},
  {path: '/company/new', topic:'companies', component: NewCompanyApp},
  {path: '/timesheet', topic:'timesheet', label: 'Timesheet', component: TimesheetApp, isMenu: true, iconName: 'clock-o'},
  {path: '/missions', topic:'missions', label: 'Missions', component: MissionApp, isMenu: true, iconName: 'thumbs-up'},
  {path: '/invoices', topic:'invoices', label: 'Invoices', component: NotFound, isMenu: true, iconName: 'credit-card'},
  {path: '/stats', topic:'stats', label: 'Stats', component: NotFound, isMenu: true, iconName: 'tachometer'},
  {path: '/people', topic:'people', label: 'People', component: NotFound, isMenu: true, iconName: 'users'},
  {path: '/marketplace', topic:'marketplace', label: 'MarketPlace', component: NotFound, isMenu: true, iconName: 'globe'},
];

export default routeData;
