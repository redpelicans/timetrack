import {createSelector} from 'reselect';
import _ from 'lodash';

const tags = state => state.tags.data
const persons = state => state.persons.data
const companies = state => state.companies.data
const label = state => state.routing.location.state && state.routing.location.state.label
const pendingRequests = state => state.pendingRequests
const filterSelector = state => state.tagList.filter
const sortCondSelector = state => state.persons.sortCond

export const tagsSelector = createSelector(
  tags,
  (tags) => {
    return {
      tags: tags.toJS().map(([tag, count]) => {return {key: tag, value: tag}}),
    }
  }
)

export const visibleTagsSelector = createSelector(
  persons, 
  companies,
  filterSelector,
  sortCondSelector,
  (persons, companies, filter, sortCond) => {
    return {
      tagList: formatTagList(persons, companies, filter, sortCond),
      filter,
      sortCond,
    }
  }
)

export const viewTagSelector = createSelector(
  persons, 
  companies,
  label,
  pendingRequests,
  (persons, companies, label, pendingRequests) => {
    return {
      persons,
      companies,
      tag: formatTag(label, persons, companies),
      label,
      isLoading: !!pendingRequests,
    }
  }
)

function formatTagList(persons, companies, filter='', sort) {
  let res = persons.filter(person => person.get('tags') && person.get('tags').size).reduce((res, person) => {
    person.get('tags').forEach(tag => (res[tag] ? res[tag]++ : res[tag] = 1))
    return res
  }, {})
  res = companies.filter(company => company.get('tags') && company.get('tags').size).reduce((res, company) => {
    company.get('tags').forEach(tag => (res[tag] ? res[tag]++ : res[tag] = 1))
    return res
  }, res)
  
  const tagArray = _.reduce(Object.keys(res), (prev, key) => {
    return [...prev, [key, res[key]]]
  }, [])
  const filteredArray = _.filter(tagArray, (tag) => {
    return tag[0].toLowerCase().indexOf(filter) !== -1
  })
  const sortedArray = sortArray(filteredArray, sort.by, sort.order)
 console.log('sortedArray = ', sortedArray) 
  return sortedArray
}

function sortArray(array, attr, order) {
  array = array.slice(0)
  if (attr === 'occurrences') {
    if (order === 'desc') return array.sort((a, b) => b[1] - a[1])
    else return array.sort((a, b) => a[1] - b[1]) 
  }
  else if (attr === 'name') {
    console.log('tab = ', array)
    if (order === 'desc') {
      console.log('sort alpha ordre descendant')
      return (
        array.sort((a, b) => {
          return b[0].toLowerCase() > a[0].toLowerCase()
        })
      )
    }
    else {
      console.log('sort alpha ordre ascendant')
      return (
        array.sort((a, b) => {
          return a[0].toLowerCase() > b[0].toLowerCase()
        })
      )
    }
  }
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
