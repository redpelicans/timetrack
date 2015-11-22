import Reflux from 'reflux';
import routes from '../sitemap';
import {navActions} from './nav';

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


