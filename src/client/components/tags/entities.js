import React, {PropTypes} from 'react'
import _ from 'lodash'

import {Preview as PersonPreview} from '../person/widgets'
import {Preview as CompanyPreview} from '../company/widgets'

let i = 0

const Entity = ({entity}) => {
  return (
    <div>
      | {entity.entityId} | {entity.entityType} |
    </div>
  )
}

const Entities = ({label, tag, companies, persons}) => {
  
  const list = _.map(tag, (entity) => {
    if (entity.entityType === 'person') {
      return (
        <PersonPreview person={persons.get(entity.entityId)} key={i++}/>
      )
    }
    else {
      return <Entity entity={entity} key={i++} />
    }
  })
  return (
    <div>{list}</div>
  )
}

export default Entities
