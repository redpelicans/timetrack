import moment from 'moment';
import Immutable from 'immutable';
import Reflux from 'reflux';
import {requestJson} from '../utils';

const actions = Reflux.createActions([
  "load", 
  "delete", 
  "create", 
  "update", 
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

  onLoad: function({forceReload=false, ids} = {}){
    // TODO: test to understand refresh ...
    state.data = Immutable.Map();
    this.trigger(state);

    const objs = _.map(ids || [], id => state.data.get(id));
    let doRequest = forceReload || !_.all(objs) || !state.data.size;

    if(!doRequest) return actions.loadCompleted(state.data);

    console.log("start loading companies ...")
    requestJson('/api/companies', {message: 'Cannot load companies, check your backend server'}).then( companies => {
        console.log("end loading companies ...")
        actions.loadCompleted(Immutable.fromJS(_.chain(companies).map( p => [p._id, Maker(p)]).object().value()));
      });

    state.isLoading = true;
    this.trigger(state);
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
        state.data = state.data.set(company._id, Immutable.fromJS(Maker(company)));
        state.isLoading = false;
        this.trigger(state);
      });
  },

  onUpdate(previous, updates){
    state.isLoading = true;
    this.trigger(state);
    requestJson('/api/company', {verb: 'put', body: {company: _.assign(previous, updates)}, message: 'Cannot update company, check your backend server'})
      .then( company => {
        state.data = state.data.set(company._id, Immutable.fromJS(Maker(company)));
        state.isLoading = false;
        this.trigger(state);
      });
  },

  onDelete(company){
    const id = company.get('_id');
    state.isLoading = true;
    this.trigger(state);
    requestJson(`/api/company/${id}`, {verb: 'delete', message: 'Cannot delete company, check your backend server'})
      .then( res => {
        state.data = state.data.delete( id );
        state.isLoading = false;
        this.trigger(state);
      });
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
  doc.createdAt = moment(doc.createdAt || new Date(1967, 9, 1));
  doc.updatedAt = moment(doc.updatedAt || new Date(1967, 9, 1));
  return doc;
}

export {store as companiesStore, actions as companiesActions};


