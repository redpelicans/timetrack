'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = citiesReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionsCities = require('../actions/cities');

var initialState = _immutable2['default'].List();

function citiesReducer(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case _actionsCities.CITIES_LOADED:
      return action.cities;
    default:
      return state;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=cities.js.map
