import React, {PropTypes} from 'react'
import _ from 'lodash'

import {Edit as EditPerson, Delete as DeletePerson, Preview as PersonPreview} from '../person/widgets'
import {Preview as CompanyPreview} from '../company/widgets'

let i = 0

const Entities = ({tag, companies, persons}) => {
  
  const list = _.map(tag, (entity) => {
    const person = persons.get(entity.entityId)
    if (entity.entityType === 'person') {
      return (
        <PersonPreview person={person} key={i++}>
          <EditPerson person={person}/>
          <DeletePerson person={person}/>
        </PersonPreview>
      )
    }
    else {
      const company = companies.get(entity.entityId)
      return (
        <CompanyPreview
          company={company}
          workers={company.get('personIds')}
          key={i++}
        />
      )
    }
  })
  return (
    <div>{list}</div>
  )
}

Entities.propTypes = {
  tag: PropTypes.array.isRequired,
  companies: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
}

export default Entities
