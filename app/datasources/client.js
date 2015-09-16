import ClientActions from '../actions/client';
import AppActions from '../actions/app';
import {requestJson} from '../utils';


const ClientDataSource = {
  doFetch: {
    remote(state) {
      return requestJson('/api/clients');
    },

    // local(state) {
    //   return state.clients.length ? state.clients : null;
    // },
   
    // BUG: Uncaught Error: Invariant Violation: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. 
    //loading: ClientActions.loading,
    success: ClientActions.loaded,
    error: ClientActions.fetchFailed
  },

  doStar: {
    remote(state, client, starred) {
      return requestJson(`/api/clients/star`, {
        method: 'post',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: client._id
          , starred: starred
        })
      });
    },
    success: ClientActions.starred,
    error: AppActions.serverError
  },
};


export default ClientDataSource;
