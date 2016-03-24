import {createSelector} from 'reselect';
import _ from 'lodash';

const tags = state => state.tags.data;
const persons = state => state.persons.data
const companies = state => state.companies.data
const label = state => state.routing.location.state && state.routing.location.state.label
const pendingRequests = state => state.pendingRequests

export const tagsSelector = createSelector(
  tags,
  (tags) => {
    return {
      tags: tags.toJS().map(([tag, count]) => {return {key: tag, value: tag}}),
    }
  }
)

export const tagListSelector = createSelector(
  persons, 
  companies,
  label,
  pendingRequests,
  (persons, companies, label, pendingRequests) => {
    return {
      tagList: formatTagList(persons, companies),
      tag: formatTag(label, persons, companies),
      label,
      isLoading: !!pendingRequests,
    }
  }
)

function formatTagList(persons, companies) {
  let res = persons.filter(person => person.get('tags') && person.get('tags').size).reduce((res, person) => {
    person.get('tags').forEach(tag => res[tag] ? res[tag]++ : res[tag] = 1)
    return res
  }, {})
  res = companies.filter(company => company.get('tags') && company.get('tags').size).reduce((res, company) => {
    company.get('tags').forEach(tag => res[tag] ? res[tag]++ : res[tag] = 1)
    return res
  }, res)

  const tagArray = _.reduce(Object.keys(res), (prev, key) => {
    return [...prev, [key, res[key]]]
  }, [])
  const sortedArray = tagArray.sort((a, b) => {
    return b[1] - a[1]
  })
  
  return sortedArray
}


function formatTag(label, persons, companies) {
  let res = persons.filter(person => person.get('tags') && person.get('tags').size).reduce((res, person) => {
    person.get('tags').forEach((tag) => {
      if (tag === label) res = [...res, {entityId: person.get('_id'), entityType: 'person'}]
    })
    return res
  }, [])
  res = companies.filter(company => company.get('tags') && company.get('tags').size).reduce((res, company) => {
    company.get('tags').forEach((tag) => {
      if (tag === label) res = [...res, {entityId: company.get('_id'), entityType: 'company'}]
    })
    return res;
  }, res)
  return res
}
