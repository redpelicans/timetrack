import {AuthManager, Auth} from 'kontrolo';

export default AuthManager([
  Auth({
    name: 'delete',
    roles: ['admin'],
  }),
  Auth({
    name: 'add',
    roles: ['admin'],
  }),
  Auth({
    name: 'admin',
    roles: ['admin'],
  }),
], {name: 'event'});
