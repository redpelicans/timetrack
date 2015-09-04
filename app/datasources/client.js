import ClientActions from '../actions/client';
import {requestJson} from '../utils';

const mockClients = [
  {id: 1, name: 'toto'},
  {id: 2, name: 'titi'},
  {id: 3, name: 'tutu'}
];

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
  }
};


export default ClientDataSource;
