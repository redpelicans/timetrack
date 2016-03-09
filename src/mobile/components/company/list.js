/* @flow */
import React from 'react-native'
import {List} from '../widgets'
import companies from '../../data/companies'

export default () => {
  return <List entities={companies} toString={(x) => x.name}/>
}
