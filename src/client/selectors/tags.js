import {createSelector} from 'reselect';
import _ from 'lodash';

const tags = state => state.tags.data
const persons = state => state.persons.data
const companies = state => state.companies.data
const label = state => state.routing.location.state && state.routing.location.state.label
const pendingRequests = state => state.pendingRequests
const filterSelector = state => state.tagList.filter

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
  (persons, companies, filter) => {
    console.log('dans selectoRR, tagList = ', formatTagList(persons, companies))
    return {
      tagList: formatTagList(persons, companies, filter), /*filterAndSort(persons, companies, filter)*/
      filter,
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

function filterAndSort(persons, companies, filter) {
  let tagList = formatTagList(persons, companies) 
  console.log('dans filterAndSort, filter = ', filter)
    let filteredList = _.filter(tagList, (tag/*, filter='', persons, companies*/) => {
    console.log('dans filterAndSort, tagList = ', tagList)
    console.log('dans filterAndSort, tag = ', tag)
      console.log('filter dans filter() = ', filter)
    if (!filter) {return tag}
    //console.log('filter type = ', typeof filter)
    //console.log('filter.length = ', filter.length)
    const keys = _.chain(filter.split(' ')).compact().map(key => key.toLowerCase()).value()
    return _.every(keys, (key/*, tag, persons, companies*/) => {
      if (tag.entityType === 'person') {
        const personName = persons.get(tag.entityId).get('name').toLowerCase()
        return personName.indexOf(key) !== -1
      } else {
        const companyName = companies.get(tag.entityId)
        return companyName.indexOf(key) !== -1
      }   
    })
  })
  console.log('FILtered LIst = ', filteredList)
  return filteredList
 //return tagList
    //.sort( (a,b) => sortByCond(a, b, sort.by, sort.order));
}

/*function isFilterInTags(filter, entity) {
  //entity.get('tags')
  console.log('entity.get(tags) = ', entity.get('tags'))
  return entity.get('tags').find((tag) => {
    return tag.indexOf(filter)
  })
}*/

function formatTagList(persons, companies, filter='') {
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
  const sortedArray = filteredArray.sort((a, b) => {
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
