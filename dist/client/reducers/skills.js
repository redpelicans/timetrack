'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = skillsReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionsSkills = require('../actions/skills');

var initialState = _immutable2['default'].List();

function skillsReducer(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case _actionsSkills.SKILLS_LOADED:
      return action.skills;
    default:
      return state;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=skills.js.map
