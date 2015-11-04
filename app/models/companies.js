import Bacon from 'baconjs';
import Dispatcher from '../utils/dispatcher';
import Immutable from 'immutable';
import {requestJson, requestPostJson, pushDataEvent} from '../utils';
import errors from '../models/errors';
import _ from 'lodash';

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

const sortCond = Bacon.update(
  {
    sortBy: 'name',
    direction: 'asc' 
  },
  [d.stream('sort')], (previous, sortBy) => {
    let keys = _.pluck(model.sortBy, 'key')
    if(!_.contains(keys, sortBy))return previous;
    if(previous.sortBy === sortBy)return {sortBy: sortBy, direction: {asc:'desc', desc: 'asc'}[previous.direction]};
    else return {sortBy: sortBy, direction: sortBy === 'name' ? 'asc': 'desc'};
  },
) 

function doSort(companies, sortCond){
  function sortAttr(sortMode){
    if(sortCond.sortBy === 'name') return ['name'];
    return [sortCond.sortBy, 'name'];
  }

  function sortOrder(sortCond){
    return [sortCond.direction, 'asc'];
  }

  // TODO: rewrite sort with Immutable
  return Immutable.fromJS(_.sortByOrder(companies.toJS(), sortAttr(sortCond), sortOrder(sortCond)));
}

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
  sortBy: [
    {key: 'name', label: 'Sort Alphabeticaly'},
    {key: 'billable', label: 'Sort by billable amount'},
    {key: 'billed', label: 'Sort by billed amount'},
    {key: 'createdAt', label: 'Sort by creation date'},
    {key: 'updatedAt', label: 'Sort by updated date'},
  ],

  load(){
    pushDataEvent(requestJson('/api/companies'), loadedCompanies);
  },

  create(company){
    requestPostJson('/api/company/new', {company: company})
      .then( () => {
        this.load();
      })
      .catch(err => {
        console.error(err.toString());
        errors.alert({
          header: 'Runtime Error',
          message: 'Cannot create company, check your backend server'
        });
      });
  },

  toggleStarFilter(){
    d.push('toggleStarFilter', 'toggle');
  },

  state: Bacon.combineTemplate({
    companies: companies.combine(starFilter, filterWithStar).combine(searchFilter, filterWithSearch).combine(sortCond, doSort),
    starFilter: starFilter,
    searchFilter: searchFilter,
    sortCond: sortCond,
  }),

  searchFilter(filter){
    d.push('searchFilter', filter);
  },

  sort(sortBy){
    d.push('sort', sortBy);
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
