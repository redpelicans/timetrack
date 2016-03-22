import {createSelector} from 'reselect';

const tags = state => state.tags;

export const tagsSelector = createSelector(
  tags,
  tags => {
    return {
      tags: tags.map(([tag, count]) => {return {key: tag, value: tag}}).toJS(),
    }
  }
)
