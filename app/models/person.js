import Reflux from 'reflux';
import routes from '../sitemap';
import {navActions} from './nav';
import {companiesStore} from './companies';
import {personsStore} from './persons';

const actions = Reflux.createActions([
  "load", 
  "view",
  "edit",
  "create",
]);

const state = {
}

const store = Reflux.createStore({

  listenables: [actions],

  init: function(){
    personsStore.listen( persons => {
      if(state.person){
        const person = persons.data.get(state.person.get('_id'));
        if(person && state.person != person){
          state.person = person;
          this.trigger(state);
        }
      }
    });

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

  onView: function({person}={}){
    state.person = person;
    state.company = undefined;
    navActions.push(routes.viewperson);
  },

  onEdit: function({person}={}){
    state.person = person;
    state.company = undefined;
    navActions.push(routes.editperson);
  },

  onCreate: function({company}={}){
    console.log("onCreate");
    state.person = undefined;
    state.company = company;
    navActions.push(routes.newperson);
  },


});


export {store as personStore, actions as personActions};


