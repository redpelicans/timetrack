import React, {PropTypes} from 'react'
import _ from 'lodash'

import {PersonPreview} from './widgets'
import {Preview as CompanyPreview} from '../company/widgets'

let i = 0

const Entities = ({tag, companies, persons}) => {
  
  const list = _.map(tag, (entity) => {

    if (entity.entityType === 'person') {
      const person = persons.get(entity.entityId)
      const company = companies.get(person.get('companyId'))
      return (
        <PersonPreview person={person} company={company} key={i++} />
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
