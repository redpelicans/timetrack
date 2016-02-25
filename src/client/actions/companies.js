import {requestJson} from '../utils';
import Immutable from 'immutable';
import moment from 'moment';
import _ from 'lodash';

export const LOAD_COMPANIES = 'LOAD_COMPANIES';
export const COMPANIES_LOADED = 'COMPANIES_LOADED';
export const TOGGLE_PREFERRED_FILTER = 'TOGGLE_PREFERRED_FILTER';
export const SORT_COMPANIES = 'SORT_COMPANIES';
export const FILTER_COMPANIES = 'FILTER_COMPANIES';
export const COMPANY_UPDATED = 'COMPANY_UPDATED';
export const COMPANY_DELETED = 'COMPANY_DELETED';
export const COMPANY_CREATED = 'COMPANY_CREATED';
export const COMPANY_TOGGLE_PREFERRED_COMPLETED = 'COMPANY_TOGGLE_PREFERRED_COMPLETED';
export const COMPANY_UPDATE_TAGS_COMPLETED = 'COMPANY_UPDATE_TAGS_COMPLETED';

export function createCompleted(){
}

export function deleteCompleted(company){
  return {
    type: COMPANY_DELETED,
    id: company._id
  }
}

export function createCompleted(company){
  return {
    type: COMPANY_CREATED,
    company: Immutable.fromJS(Maker(company))
  }
}

export function updateCompleted(company){
  return {
    type: COMPANY_UPDATED,
    company: Immutable.fromJS(Maker(company))
  }
}

export function companiesLoaded(companies){
  return {
    type: COMPANIES_LOADED,
    companies: Immutable.fromJS(_.reduce(companies, (res, p) => { res[p._id] = Maker(p); return res}, {})),
  }
}

function togglePreferredCompleted(id, preferred){
  return {
    type: COMPANY_TOGGLE_PREFERRED_COMPLETED,
    id,
    preferred
  }
}

export function filter(filter){
  return {
    type: FILTER_COMPANIES,
    filter
  }
}

export function sort(by){
  return {
    type: SORT_COMPANIES,
    by
  }
}

export function togglePreferred(company){
  return (dispatch, getState) => {
    const body = { id: company._id , preferred: !company.preferred};
    const message = 'Cannot toggle preferred status, check your backend server';
    const request = requestJson(`/api/companies/preferred`, dispatch, getState, {verb: 'post', body, message});

    request.then( res => {
      const state = getState();
      dispatch(togglePreferredCompleted(res._id, body.preferred));
    });
  }
}

export function togglePreferredFilter(){
  return {
    type: TOGGLE_PREFERRED_FILTER
  }
}

export function loadCompanies({forceReload=false, ids=[]} = {}){
  return (dispatch, getState) => {
    const state = getState();
    const objs = _.map(ids, id => state.companies.data.get(id));
    let doRequest = forceReload || !_.every(objs) || !state.companies.data.size;
    if(!doRequest) return;

    if(typeof timetrackInitCompanies != 'undefined' && timetrackInitCompanies){
      console.log("Loading server side Companies")
      return companiesLoaded(timetrackInitCompanies)
      // dispatch(companiesLoaded(timetrackInitCompanies))
      // timetrackInitCompanies = undefined;
      // return
    }

    const url = '/api/companies';
    dispatch({type: LOAD_COMPANIES});
    requestJson(url, dispatch, getState, {message: 'Cannot load companies, check your backend server'})
      .then( companies => {
        dispatch(companiesLoaded(companies));
      });
  }
}

export function deleteCompany(company){
  return (dispatch, getState) => {
    const id = company._id;
    requestJson(`/api/company/${id}`, dispatch, getState, {verb: 'delete', message: 'Cannot delete company, check your backend server'})
      .then( res => dispatch(deleteCompleted(company)) );
  }
}

export function updateCompany(previous, updates){
  return (dispatch, getState) => {
    requestJson('/api/company', dispatch, getState, {verb: 'put', body: {company: {...previous, ...updates}}, message: 'Cannot update company, check your backend server'})
      .then( company => {
        dispatch(updateCompleted(company));
      });
  }
}

export function createCompany(company){
  return (dispatch, getState) => {
    requestJson('/api/companies', dispatch, getState, {verb: 'post', body: {company: company}, message: 'Cannot create company, check your backend server'})
      .then( company => {
        dispatch(createCompleted(company));
      });
  }
}

function updateTagsCompleted(company){
  return {
    type: COMPANY_UPDATE_TAGS_COMPLETED,
    id: company._id,
    tags: Immutable.fromJS(company.tags),
  }
}

export function updateTags(company, tags){
  return (dispatch, getState) => {
    let body = { _id: company._id , tags};
    const message = 'Cannot update tags, check your backend server';
    let request = requestJson(`/api/companies/tags`,dispatch, getState, {verb: 'post', body: body, message: message});

    request.then( company => dispatch(updateTagsCompleted(company)));
  }
}

export const companiesActions = {
  updateTags,
  createCompleted,
  updateCompleted,
  deleteCompleted,
  load: loadCompanies,
  create: createCompany,
  update: updateCompany,
  delete: deleteCompany,
  togglePreferredFilter,
  togglePreferred,
  sort,
  filter,
}

function Maker(doc){
  console.log(doc.name)
  doc.createdAt = moment(doc.createdAt);
  if(doc.updatedAt) doc.updatedAt = moment(doc.updatedAt);
  return doc;
}


