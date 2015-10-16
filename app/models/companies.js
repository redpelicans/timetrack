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

function filterWithStar(companies, filter){
  if(filter){
    return companies.filter( c => c.get('starred') );
  }else{
    return companies;
  }
}

function filterWithSearch(companies, filter){
  if(filter){
    return companies.filter( c => {
      let name = c.get('name') || '';
      return name.toLowerCase().indexOf(filter) !== -1;
    })
  }else{
    return companies;
  }
}

const searchFilter = Bacon.update(
  '',
  [d.stream('searchFilter')], (previous, filter) => filter,

);

const model = {
  load(){
    pushDataEvent(requestJson('/api/companies'), loadedCompanies);
  },

  toggleStarFilter(){
    d.push('toggleStarFilter', 'toggle');
  },

  state: Bacon.combineTemplate({
    companies: companies.combine(starFilter, filterWithStar).combine(searchFilter, filterWithSearch),
    starFilter: starFilter,
    searchFilter: searchFilter,
  }),

  searchFilter(filter){
    d.push('searchFilter', filter);
  },

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
