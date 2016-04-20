import _ from 'lodash'

export const getInitials = (name='') => {
  let parts = name.split(' ').slice(0, 3);
  return _.map(parts, part => part.substr(0,1).toUpperCase()).join('');
}


