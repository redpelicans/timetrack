'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _note = require('./note');

var _note2 = _interopRequireDefault(_note);

var events = _extends({
  'person.new': { right: 'person.view' },
  'person.delete': { right: 'person.view' },
  'person.update': { right: 'person.view' },

  'company.new': { right: 'company.view' },
  'company.delete': { right: 'company.view' },
  'company.update': { right: 'company.view' },

  'mission.new': { right: 'mission.view' },
  'mission.delete': { right: 'mission.view' },
  'mission.update': { right: 'mission.view' }

}, _note2['default']);

exports['default'] = events;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
