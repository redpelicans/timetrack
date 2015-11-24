import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';
import {companiesActions} from './companies';

const actions = Reflux.createActions([
  "load", 
  "loadCompleted", 
  "togglePreferred", 
  "delete", 
  "create", 
  "update", 
]);

const state = {
  data: Immutable.Map(),
  isLoading: false,
}


const store = Reflux.createStore({


  listenables: [actions],

  getInitialState: function(){
    return state;
  },

  onLoad: function({forceReload=false, ids} = {}){
    const objs = _.map(ids || [], id => state.data.get(id));
    let doRequest = forceReload || !_.all(objs) || !state.data.size;

    if(!doRequest) return actions.loadCompleted(state.data);

    console.log("start loading persons ...")
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/people', {message: 'Cannot load people, check your backend server'}).then( people => {
      console.log("end loading persons ...")
      actions.loadCompleted(Immutable.fromJS(_.chain(people).map( p => [p._id, Maker(p)]).object().value()));
    });
  },

  onLoadCompleted: function(data){
    state.data = data;
    state.isLoading = false;
    this.trigger(state);
  },

  onTogglePreferred(person){
    let body = { id: person.get('_id') , preferred: !person.get('preferred')};
    const message = 'Cannot toggle preferred status, check your backend server';
    let request = requestJson(`/api/people/preferred`, {verb: 'post', body: body, message: message});
    state.isLoading = true;
    this.trigger(state);

    request.then( res => {
      state.data = state.data.update(res._id, p =>  p.set('preferred', body.preferred) );
      state.isLoading = false;
      this.trigger(state);
    });
  },

  onCreate(person){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/people', {verb: 'post', body: {person: person}, message: 'Cannot create person, check your backend server'})
      .then( person => {
        state.data = state.data.set(person._id,  Immutable.fromJS(Maker(person)));
        companiesActions.addPerson(person);
        //companiesActions.updateRelations([person.companyId]);
        state.isLoading = false;
        this.trigger(state);
      });
  },

  onUpdate(previous, updates){
    const next = _.assign({}, previous, updates);
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/person', {verb: 'put', body: {person: next}, message: 'Cannot update person, check your backend server'})
      .then( person => {
        state.data = state.data.set( person._id, Immutable.fromJS(Maker(person)) );
        if(previous.companyId !== person.companyId){
          companiesActions.removePerson(previous);
          companiesActions.addPerson(person);
        }
        state.isLoading = false;
        this.trigger(state);
      });
  },

  onDelete(person){
    const id = person._id;
    state.isLoading = true;
    this.trigger(state);
    requestJson(`/api/person/${id}`, {verb: 'delete', message: 'Cannot delete person, check your backend server'})
      .then( res => {
        state.data = state.data.delete( id );
        companiesActions.removePerson(person);
        //companiesActions.updateRelations([person.companyId]);
        state.isLoading = false;
        this.trigger(state);
      });
  },

});

function Maker(doc){
  doc.createdAt = moment(doc.createdAt || new Date(1967, 9, 1));
  doc.updatedAt = moment(doc.updatedAt || new Date(1967, 9, 1));
  return doc;
}

export {store as personsStore, actions as personsActions};


