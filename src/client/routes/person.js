import ListPersonApp from '../containers/person/list';
import ViewPersonApp from '../containers/person/view';
import {NewPersonApp, EditPersonApp} from '../containers/person/edit';
import {Route, RouteManager} from 'kontrolo';
import {isAdmin, isWorker} from '../lib/person'

const routes = RouteManager([
  Route({
    name: 'list',
    path: '/people',
    topic:'people',
    label: 'People', 
    component: ListPersonApp,
    isMenu: 2,
    iconName: 'users',
    authRequired: true
  }),
  Route({
    name: 'new',
    path: '/person/new',
    topic:'people',
    component: NewPersonApp,
    authRoles: ['admin', 'edit', 'person.edit'],
  }),
  Route({
    name: 'edit',
    path: '/person/edit',
    topic:'people',
    component: EditPersonApp,
    authRoles: ['admin', 'edit', 'person.edit'],
    authMethod: function(user, getState, context){
      if(!context){
        const state = getState()
        const personId = state.routing.location.state && state.routing.location.state.personId
        if(!personId) return false
        context = {person: state.persons.data.get(personId)}
      }
      if(!context.person) return false
      return isAdmin(user) || !isWorker(context.person)
    }
  }),
  Route({
    name: 'view',
    //path: '/person/view',
    path: '/person/:personId',
    topic:'people',
    component: ViewPersonApp,
  }),
], {name: 'person'});

export default routes;
