import ListMissionApp from '../views/mission/list';
import {NewMissionApp, EditMissionApp} from '../views/mission/edit';
import ViewMissionApp from '../views/mission/view';
import {Route, RouteManager} from 'kontrolo';

const routes = RouteManager([
  Route({
    name: 'list',
    path: '/missions',
    topic:'missions',
    label: 'Missions', 
    component: ListMissionApp,
    isMenu: 3,
    iconName: 'shopping-cart',
    authRequired: true
  }),
  Route({
    name: 'new',
    path: '/mission/new',
    topic:'missions',
    component: NewMissionApp,
    authRoles: ['admin'],
  }),
  Route({
    name: 'edit',
    path: '/mission/edit',
    topic:'missions',
    component: EditMissionApp,
    authRoles: ['admin'],
    authMethod: function(user, {mission}={}){
      if(!mission) return true;
      return mission.get('status') !== 'closed';
    }
  }),
  Route({
    name: 'view',
    path: '/mission/view',
    topic:'missions',
    component: ViewMissionApp,
  }),
], {name: 'mission'});

export default routes;
