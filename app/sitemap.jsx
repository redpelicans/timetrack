import _ from 'lodash';
import NotFound from './views/not-found';
import CompanyListApp from './views/company/list';
import PersonListApp from './views/person/list';
import LoginApp from './views/login';
import {NewCompanyApp, EditCompanyApp} from './views/company/edit';
import ViewCompanyApp from './views/company/view';
import {NewPersonApp, EditPersonApp} from './views/person/edit';
import ViewPersonApp from './views/person/view';

class _Route {
  constructor({name, path, topic, defaultRoute=false, label, component, isMenu=false, iconName, authRequired=false, authRoles}={}){
    this.name = name;
    this.path = path;
    this.topic = topic;
    this.defaultRoute = defaultRoute;
    this.label = label;
    this.component = component;
    this.isMenu = isMenu;
    this.iconName = iconName;
    this.authRequired = authRequired;
    this.authRoles = authRoles;
    if(this.authRoles)this.authRequired = true;
  }
}

function Route(...elt){
  return new _Route(...elt);
}

class SiteMap{
  constructor(routes=[]){
    this.routes = routes;
    _.extend(this, _.chain(routes).map(route => [route.name, route]).object().value());
  }

  get defaultRoute(){
    return _.find(this.routes, r => r.defaultRoute);
  }

  [Symbol.iterator](){
    return this.routes;
  }
}

const routes = new SiteMap([
  Route({
    name: 'companies',
    path: '/companies',
    defaultRoute: true,
    topic:'companies',
    label: 'Companies', 
    component: CompanyListApp,
    isMenu: true,
    iconName: 'building',
    authRequired: true
  }),
  Route({
    name: 'newcompany',
    path: '/company/new',
    topic:'companies',
    component: NewCompanyApp,
    authRequired: true
  }),
  Route({
    name: 'editcompany',
    path: '/company/edit',
    topic:'companies',
    component: EditCompanyApp,
    authRequired: true
  }),
  Route({
    name: 'viewcompany',
    path: '/company/view',
    topic:'companies',
    component: ViewCompanyApp,
    authRequired: true
  }),
  Route({
    name: 'people',
    path: '/people',
    topic:'people',
    label: 'People', 
    component: PersonListApp,
    isMenu: true,
    iconName: 'users',
    authRequired: true
  }),
  Route({
    name: 'newperson',
    path: '/person/new',
    topic:'people',
    component: NewPersonApp,
    authRequired: true
  }),
  Route({
    name: 'editperson',
    path: '/person/edit',
    topic:'people',
    component: EditPersonApp,
    authRequired: true
  }),
  Route({
    name: 'viewperson',
    path: '/person/view',
    topic:'people',
    component: ViewPersonApp,
    authRequired: true
  }),
  Route({
    name: 'notfound',
    component: NotFound,
  }),
  Route({
    name: 'login',
    path: '/login',
    component: LoginApp,
  }),
]);

export default routes;
