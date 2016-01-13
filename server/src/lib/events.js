const events = {
  'person.new': { roles: ['admin'] },
  'person.delete': { roles: ['admin'] },
  'person.update': { roles: ['admin'] },

  'company.new': { roles: ['admin'] },
  'company.delete': { roles: ['admin'] },
  'company.update': { roles: ['admin'] },

  'mission.view': { roles: [] },
  'mission.new': { roles: ['admin'] },
  'mission.delete': { roles: ['admin'] },
  'mission.update': { roles: ['admin'] },
}

export default events;
