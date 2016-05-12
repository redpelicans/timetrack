const rights = {
  'person.view': { roles: [] },
  'person.new': { roles: ['admin', 'edit', 'person.edit'] },
  'person.delete': { roles: ['admin', 'edit', 'person.edit'] },
  'person.update': { roles: ['admin', 'edit', 'person.edit'] },
  'person.preferred': { roles: [] },

  'company.view': { roles: [] },
  'company.new': { roles: ['admin', 'edit', 'company.edit'] },
  'company.delete': { roles: ['admin', 'edit', 'company.edit'] },
  'company.update': { roles: ['admin', 'edit', 'company.edit'] },
  'company.preferred': { roles: [] },

  'mission.view': { roles: [] },
  'mission.new': { roles: ['admin'] },
  'mission.delete': { roles: ['admin'] },
  'mission.update': { roles: ['admin'] },

  'event.view': { roles: [] },
  'event.new': { roles: [] },
  'event.delete': { roles: ['admin'] },
  // TODO
  'event.update': { roles: [] },
}

export default rights;
