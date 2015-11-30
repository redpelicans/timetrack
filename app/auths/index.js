import {AuthManager, Auth} from 'kontrolo';
import {loginStore} from '../models/login';
import personAuthManager from './person';
import companyAuthManager from './company';

export default AuthManager([
  personAuthManager,
  companyAuthManager,
], {loginStore: loginStore});
