/* @flow */
import React from 'react-native'
import {List} from '../widgets'
import missions from '../../data/missions'

export default () => {
  return <List entities={missions} toString={(x) => x.name}/>
}
