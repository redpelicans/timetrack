import alt from '../alt';
import { datasource, createStore } from 'alt/utils/decorators';
import ClientActions from '../actions/client';
import ClientDataSource from '../datasources/client';

@createStore(alt)
@datasource(ClientDataSource)
export default class ClientStore{
  constructor(){
    this.clients = [];
    this.bindActions(ClientActions);
  }

  fetch(){
    console.log("fetch clients ...")
    if(!this.getInstance().isLoading()){
      this.getInstance().doFetch();
    }
  }

  loaded(clients){
    console.log("loaded ...")
    this.clients = clients;
  }

  loading(){
    console.log("loading clients ...");
    //this.loading = true;
  }

  fetchFailed(){
    console.log("loading error ...");
  }
}
