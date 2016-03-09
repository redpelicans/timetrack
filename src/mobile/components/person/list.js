/* @flow */
import React from 'react-native'
import {List} from '../widgets'
import people from '../../data/people'

export default () => {
  return <List entities={people} toString={(x) => x.firstName + " " + x.lastName}/>
}
