import _ from 'lodash'

export const isTenant = (company) => {
  return company.get('type') === 'tenant'
}

export const hasMissions = (company, missions) => {
  return missions.some(mission => mission.get('clientId') === company.get('_id') || mission.get('partnerId') === company.get('_id'))
}
