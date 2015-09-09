import alt from '../alt';
import { datasource, createStore } from 'alt/utils/decorators';
import ClientActions from '../actions/client';
import ClientDataSource from '../datasources/client';

@createStore(alt)
@datasource(ClientDataSource)
export default class ClientStore{
  constructor(){
    this.clients = [];
    this.sortMode = {attribute: 'billed', order: 'desc'};
    this.filter = '';
    this.bindActions(ClientActions);
  }

  sortMainList(sortMode){
    if(this.sortMode.attribute === sortMode.attribute){
      this.sortMode.order = {'asc': 'desc', 'desc': 'asc'}[this.sortMode.order] || 'asc';
    }else{
      this.sortMode.attribute = sortMode.attribute;
      this.sortMode.order = sortMode.attribute === 'name' ? 'asc' : 'desc';
    }
  }

  filterMainList(data){
    this.filter = data.filter;
  }

  fetch(){
    if(!this.getInstance().isLoading()){
      this.getInstance().doFetch();
    }
  }

  loaded(clients){
    console.log('loaded ...')
    this.clients = clients;
  }

  loading(){
    console.log('loading clients ...');
    //this.loading = true;
  }

  fetchFailed(){
    console.log('loading error ...');
  }
}
