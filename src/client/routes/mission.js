import ListMissionApp from '../containers/mission/list';
import ViewMissionApp from '../containers/mission/view';
import {NewMissionApp, EditMissionApp} from '../containers/mission/edit';
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
