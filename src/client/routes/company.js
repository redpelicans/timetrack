import ListCompanyApp from '../containers/company/list';
import ViewCompanyApp from '../containers/company/view';
import {NewCompanyApp, EditCompanyApp} from '../containers/company/edit';
import {Route, RouteManager} from 'kontrolo';
import {isAdmin} from '../lib/user'
import {isTenant} from '../lib/company'

const routes = RouteManager([
  Route({
    name: 'list',
    path: '/companies',
    defaultRoute: true,
    topic:'companies',
    label: 'Companies', 
    component: ListCompanyApp,
    isMenu: 1,
    iconName: 'building',
    authRequired: true
  }),
  Route({
    name: 'new',
    path: '/company/new',
    topic:'companies',
    component: NewCompanyApp,
    authRoles: ['admin', 'edit', 'company.edit'],
  }),
  Route({
    name: 'edit',
    path: '/company/edit',
    topic:'companies',
    component: EditCompanyApp,
    authRoles: ['admin', 'edit', 'company.edit'],
    authMethod: function(user, getState, context){
      if(!context){
        const state = getState()
        const companyId = state.routing.location.state && state.routing.location.state.companyId
        if(!companyId) return false
        context = {company: state.companies.data.get(companyId)}
      }
      if(!context.company) return false
      return isAdmin(user) || !isTenant(context.company)
    }

  }),
  Route({
    name: 'view',
    path: '/company/view',
    topic:'companies',
    component: ViewCompanyApp,
    authRequired: true
  }),
], {name: 'company'});

export default routes;
