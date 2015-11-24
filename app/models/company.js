import Reflux from 'reflux';
import routes from '../sitemap';
import {navActions} from './nav';
import {companiesStore} from './companies';

const actions = Reflux.createActions([
  "load", 
  "view",
  "edit",
  "create",
]);

const state = {};

const store = Reflux.createStore({

  listenables: [actions],

  init: function(){
    companiesStore.listen( companies => {
      if(state.company && state.company !== companies.data.get(state.company.get('_id'))){
        state.company = companies.data.get(state.company.get('_id'));
        this.trigger(state);
      }
    });
  },

  onLoad: function(){
    this.trigger(state);
  },

  onView: function({company}={}){
    state.company = company;
    navActions.push(routes.viewcompany);
  },

  onEdit: function({company}={}){
    state.company = company;
    navActions.push(routes.editcompany);
  },

  onCreate: function(){
    state.company = undefined;
    navActions.push(routes.newcompany);
  },

});


export {store as companyStore, actions as companyActions};


