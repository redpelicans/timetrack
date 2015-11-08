import NotFound from './components/not-found';
import CompanyListApp from './views/company/list';
import {NewCompanyApp, EditCompanyApp} from './views/company/edit';
import ViewCompanyApp from './views/company/view';
import MissionApp from './components/mission/app';
import TimesheetApp from './components/timesheet/app';
import HomeApp from './views/home';


let routeData = {
  home: {path: '/home', topic:'home', label: 'Home', component: HomeApp, isMenu: false, iconName: 'home'},
  companies: {path: '/companies', topic:'companies', label: 'Companies', component: CompanyListApp, isMenu: true, iconName: 'building'},
  newcompany: {path: '/company/new', topic:'companies', component: NewCompanyApp},
  editcompany: {path: '/company/edit', topic:'companies', component: EditCompanyApp},
  viewcompany: {path: '/company/view', topic:'companies', component: ViewCompanyApp},
  timesheet: {path: '/timesheet', topic:'timesheet', label: 'Timesheet', component: TimesheetApp, isMenu: true, iconName: 'clock-o'},
  missions: {path: '/missions', topic:'missions', label: 'Missions', component: MissionApp, isMenu: true, iconName: 'thumbs-up'},
  invoices: {path: '/invoices', topic:'invoices', label: 'Invoices', component: NotFound, isMenu: true, iconName: 'credit-card'},
  stats: {path: '/stats', topic:'stats', label: 'Stats', component: NotFound, isMenu: true, iconName: 'tachometer'},
  people: {path: '/people', topic:'people', label: 'People', component: NotFound, isMenu: true, iconName: 'users'},
  marketplace: {path: '/marketplace', topic:'marketplace', label: 'MarketPlace', component: NotFound, isMenu: true, iconName: 'globe'},
};

export default routeData;
