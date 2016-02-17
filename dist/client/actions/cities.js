'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.loadCities = loadCities;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var CITIES_LOADED = 'CITIES_LOADED';

exports.CITIES_LOADED = CITIES_LOADED;
function citiesLoaded(cities) {
  return {
    type: CITIES_LOADED,
    cities: _immutable2['default'].fromJS(cities)
  };
}

function loadCities() {
  return function (dispatch, getState) {
    (0, _utils.requestJson)('/api/cities', dispatch, getState, { message: 'Cannot load cities, check your backend server' }).then(function (cities) {
      return dispatch(citiesLoaded(cities));
    });
  };
}

var citiesActions = {
  load: loadCities
};
exports.citiesActions = citiesActions;
//# sourceMappingURL=cities.js.map
