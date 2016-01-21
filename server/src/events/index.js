import note from './note';

const events = {
  'person.new': { right: 'person.view' },
  'person.delete': { right: 'person.view' },
  'person.update': { right: 'person.view' },

  'company.new': { right: 'company.view' },
  'company.delete': { right: 'company.view' },
  'company.update': { right: 'company.view' },

  'mission.new': { right: 'mission.view' },
  'mission.delete': { right: 'mission.view' },
  'mission.update': { right: 'mission.view' },

  ...note,
}

export default events;
