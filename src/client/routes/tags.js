import ListTagsApp from '../containers/tags/list.js'
import ViewTagApp from '../containers/tags/view.js'
import {Route, RouteManager} from 'kontrolo'

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
  Route({
    name: 'view',
    path: '/tags/view',
    topic: 'tags',
    component: ViewTagApp,
  }),
], {name: 'tags'})

export default routes
