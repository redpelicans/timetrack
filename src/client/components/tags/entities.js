import React, {PropTypes} from 'react'
import _ from 'lodash'

let i = 0

const Entity = ({entity}) => {
  return (
    <div>
      | {entity.entityId} | {entity.entityType} |
    </div>
  )
}

const Entities = ({label, tag}) => {
  
  const list = _.map(tag, (entity) => {
    return (
      <Entity entity={entity} key={i++} />
    )
  })
  return (
    <div>{list}</div>
  )
}

export default Entities
