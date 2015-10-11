import Bacon from 'baconjs';
import Dispatcher from '../utils/dispatcher';
import Immutable from 'immutable';
import {requestJson, pushDataEvent} from '../utils';
import errors from '../models/errors';

const d = new Dispatcher();

let loadedCompanies = new Bacon.Bus();

const companies = Bacon.update(
  Immutable.List([]),
  [loadedCompanies], function(state, companies){return Immutable.fromJS(companies)},
  [d.stream('update')], update,
);

function update(state, company){
  let index = state.findIndex( x => x.get('_id') === company._id);
  return index !== -1 ? state.splice(index, 1, Immutable.fromJS(company)) : state;
}

// A refaire sans Property
const starFilter = Bacon.update(
  false,
  [d.stream('toggleStarFilter')], filter => !filter,
);

function filter(companies, filter){
  if(filter){
    return companies.filter( c => c.get('starred') );
  }else{
    return companies;
  }
}

const model = {
  load(){
    pushDataEvent(requestJson('/api/companies'), loadedCompanies);
  },

  toggleStarFilter(){
    d.push('toggleStarFilter', 'toggle');
  },

  state: Bacon.combineTemplate({
    companies: companies.combine(starFilter, filter),
    starFilter: starFilter,
  }),

  toggleStar(company){
    let request = requestJson(`/api/companies/star`, {
      method: 'post',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id: company._id
        , starred: !company.starred
      })
    });

    pushDataEvent(request, d.stream('update'), err => {
      errors.alert({
        header: 'Communication Problem',
        message: 'Cannot update company, check your backend server'
      });
    });
  }
}

export default model;
