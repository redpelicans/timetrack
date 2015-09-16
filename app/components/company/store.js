import alt from '../../alt';
import { datasource, createStore } from 'alt/utils/decorators';
import CompanyActions from './actions';
import CompanyDataSource from './datasource';

@createStore(alt)
@datasource(CompanyDataSource)
export default class CompanyStore{
  constructor(){
    this.companies = [];
    this.sortMode = {attribute: 'billed', order: 'desc'};
    this.filter = '';
    this.starredFilter = false;
    this.bindActions(CompanyActions);
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

  loaded(companies){
    console.log('loaded ...')
    this.companies = companies;
  }

  loading(){
    console.log('loading companies ...');
    //this.loading = true;
  }

  fetchFailed(){
    console.log('loading error ...');
  }

  star(companyId){
    let company = _.find(this.companies, c => c._id === companyId)
    //client.starred = {true: false, false: true}[client.starred || false];
    this.getInstance().doStar(company, {true: false, false: true}[company.starred || false]);
  }

  starred(company){
    let cachedCompany = _.find(this.companies, c => c._id === company._id)
    cachedCompany.starred = company.starred;
  }
}
