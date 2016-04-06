const rights = {
  'person.view': { roles: [] },
  'person.new': { roles: ['admin'] },
  'person.delete': { roles: ['admin'] },
  'person.update': { roles: ['admin'] },

  'company.view': { roles: [] },
  'company.new': { roles: ['admin'] },
  'company.delete': { roles: ['admin'] },
  'company.update': { roles: ['admin'] },

  'mission.view': { roles: [] },
  'mission.new': { roles: ['admin'] },
  'mission.delete': { roles: ['admin'] },
  'mission.update': { roles: ['admin'] },

  'event.view': { roles: [] },
  'event.new': { roles: ['admin'] },
  'event.delete': { roles: ['admin'] },
  'event.update': { roles: ['admin'] },
}

export default rights;
