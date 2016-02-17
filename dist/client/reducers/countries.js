'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = countriesReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionsCountries = require('../actions/countries');

var initialState = _immutable2['default'].List();

function countriesReducer(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case _actionsCountries.COUNTRIES_LOADED:
      return action.countries;
    default:
      return state;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=countries.js.map
