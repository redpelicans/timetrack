'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.loadSkills = loadSkills;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var SKILLS_LOADED = 'SKILLS_LOADED';

exports.SKILLS_LOADED = SKILLS_LOADED;
function skillsLoaded(skills) {
  return {
    type: SKILLS_LOADED,
    skills: _immutable2['default'].fromJS(skills)
  };
}

function loadSkills() {
  return function (dispatch, getState) {
    (0, _utils.requestJson)('/api/skills', dispatch, getState, { message: 'Cannot load skills, check your backend server' }).then(function (skills) {
      return dispatch(skillsLoaded(skills));
    });
  };
}

var skillsActions = {
  load: loadSkills
};
exports.skillsActions = skillsActions;
//# sourceMappingURL=skills.js.map
