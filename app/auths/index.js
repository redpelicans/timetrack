import {AuthManager, Auth} from 'kontrolo';
import {loginStore} from '../models/login';
import personAuthManager from './person';
import companyAuthManager from './company';
import missionAuthManager from './mission';

export default AuthManager([
  personAuthManager,
  companyAuthManager,
  missionAuthManager,
], {loginStore: loginStore});
