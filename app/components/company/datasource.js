import CompanyActions from './actions';
import MainActions from '../main/actions';
import {requestJson} from '../../utils';


const CompanyDataSource = {
  doFetch: {
    remote(state) {
      return requestJson('/api/companies');
    },

    // local(state) {
    //   return state.clients.length ? state.clients : null;
    // },
   
    // BUG: Uncaught Error: Invariant Violation: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. 
    //loading: CompanyActions.loading,
    success: CompanyActions.loaded,
    error: CompanyActions.fetchFailed
  },

  doStar: {
    remote(state, company, starred) {
      return requestJson(`/api/companies/star`, {
        method: 'post',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: company._id
          , starred: starred
        })
      });
    },
    success: CompanyActions.starred,
    error: MainActions.serverError
  },
};


export default CompanyDataSource;
