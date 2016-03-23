import ListTagsApp from '../containers/tags/list.js';
import {Route, RouteManager} from 'kontrolo';

const routes = RouteManager([
  Route({
    name: 'list',
    path: '/tags',
    topic: 'tags',
    label: 'Tags',
    component: ListTagsApp,
    isMenu: 5,
    iconName: 'tags',
    authRequired: true,
  }),
], {name: 'tags'});

export default routes;
