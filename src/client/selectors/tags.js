import {createSelector} from 'reselect';
import _ from 'lodash';

const tags = state => state.tags.data;
const persons = state => state.persons.data
const companies = state => state.companies.data

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
  (persons, companies) => {
    let res = persons.filter(person => person.get('tags') && person.get('tags').size).reduce((res, person) => {
      person.get('tags').forEach(tag => res[tag] ? res[tag]++ : res[tag] = 1);
      return res;
    }, {});
    res = companies.filter(company => company.get('tags') && company.get('tags').size).reduce((res, company) => {
      company.get('tags').forEach(tag => res[tag] ? res[tag]++ : res[tag] = 1);
      return res;
    }, res)

    const tagArray = _.reduce(Object.keys(res), (prev, key) => {
      return [...prev, [key, res[key]]]
    }, [])
    const sortedArray = tagArray.sort((a, b) => {
      return b[1] - a[1]
    })

    return {
      tagList: sortedArray
    }
  }
)
