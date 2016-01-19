import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';
import {personsActions} from './persons';

const actions = Reflux.createActions([
  "load", 
  "reload", 
  "delete", 
  "deleteCompleted", 
  "create", 
  "createCompleted", 
  "update", 
  "updateCompleted", 
  "updateTags",
  "leave", 
  "addPerson",
  "removePerson",
  "updateRelations",
  "loadCompleted", 
  "togglePreferred"
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

  onLoad: function({forceReload=false, ids=[]} = {}){
    const objs = _.map(ids, id => state.data.get(id));
    let doRequest = forceReload || !_.all(objs) || !state.data.size;

    if(!doRequest) return actions.loadCompleted(state.data);

    const url = '/api/companies';

    console.log("start loading companies ...")
    state.isLoading = true;
    this.trigger(state);
    requestJson(url, {message: 'Cannot load companies, check your backend server'}).then( companies => {
        console.log("end loading companies ...")
        actions.loadCompleted.sync = true;
        actions.loadCompleted(Immutable.fromJS(_.chain(companies).map( p => [p._id, Maker(p)]).object().value()));
      });

  },

  onAddPerson(person){
    if(!person.companyId) return;
    state.data = state.data.update( person.companyId, c => c.update('personIds', ids => ids.push(person._id)));
    this.trigger(state);
  },

  onRemovePerson(person){
    if(!person.companyId) return;
    state.data = state.data.update( person.companyId, c => {
      const index = c.get('personIds').findIndex(id => id === person._id);
      // send error
      if(index === -1) return c;
      return c.update('personIds', ids => ids.delete(index));
    });
    this.trigger(state);
  },

  onLeave: function(company, person){
    personsActions.update(person.toJS(), person.set('companyId', undefined).toJS());
  },

  onReload: function(ids){
  },

  onLoadCompleted: function(data){
    state.data = data;
    state.isLoading = false;
    this.trigger(state);
  },

  onCreate(company){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/companies', {verb: 'post', body: {company: company}, message: 'Cannot create company, check your backend server'})
      .then( company => {
        state.isLoading = false;
        actions.createCompleted.sync = true;
        actions.createCompleted(company);
      });
  },

  onCreateCompleted(company){
    state.data = state.data.set(company._id, Immutable.fromJS(Maker(company)));
    this.trigger(state);
  },

  onUpdateTags(company, tags){
    let body = { _id: company.get('_id') , tags};
    const message = 'Cannot update tags, check your backend server';
    let request = requestJson(`/api/companies/tags`, {verb: 'post', body: body, message: message});

    request.then( company => {
      state.data = state.data.update(company._id, p =>  p.set('tags', Immutable.fromJS(company.tags)) );
      this.trigger(state);
    });
  },

  onUpdate(previous, updates){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/company', {verb: 'put', body: {company: _.assign(previous, updates)}, message: 'Cannot update company, check your backend server'})
      .then( company => {
        state.isLoading = false;
        actions.updateCompleted.sync = true;
        actions.updateCompleted(previous, company);
      });
  },
  
  onUpdateCompleted(previous, company){
    state.data = state.data.set(company._id, Immutable.fromJS(Maker(company)));
    this.trigger(state);
  },

  onUpdateRelations(ids){
    const companyIds = _.chain(ids).compact().uniq().value();
    actions.load({ids: companyIds, forceReload: true});
  },

  onDelete(company){
    const id = company._id;
    state.isLoading = true;
    this.trigger(state);
    requestJson(`/api/company/${id}`, {verb: 'delete', message: 'Cannot delete company, check your backend server'})
      .then( res => {
        state.isLoading = false;
        actions.deleteCompleted.sync = true;
        actions.deleteCompleted(company);
      });
  },

  onDeleteCompleted(company){
    state.data = state.data.delete( company._id );
    this.trigger(state);
  },

  onTogglePreferred(company){
    let body = { id: company.get('_id') , preferred: !company.get('preferred')};
    const message = 'Cannot toggle preferred status, check your backend server';
    let request = requestJson(`/api/companies/preferred`, {verb: 'post', body: body, message: message});
    state.isLoading = true;
    this.trigger(state);

    request.then( res => {
      state.data = state.data.update(res._id, p =>  p.set('preferred', body.preferred) );
      state.isLoading = false;
      this.trigger(state);
    });
  },
});

function Maker(doc){
  doc.createdAt = moment(doc.createdAt);
  if(doc.updatedAt) doc.updatedAt = moment(doc.updatedAt);
  return doc;
}

export {store as companiesStore, actions as companiesActions};


