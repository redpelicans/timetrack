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
    this.starredFilter = false;
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

  filterStarredList(data){
    this.starredFilter = data.starred;
  }

  fetch(){
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

  star(clientId){
    let client = _.find(this.clients, c => c._id === clientId)
    //client.starred = {true: false, false: true}[client.starred || false];
    this.getInstance().doStar(client, {true: false, false: true}[client.starred || false]);
  }

  starred(client){
    let cachedClient = _.find(this.clients, c => c._id === client._id)
    cachedClient.starred = client.starred;
  }
}
