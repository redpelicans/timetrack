'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _reselect = require('reselect');

var cities = function cities(state) {
  return state.cities;
};

var citiesSelector = (0, _reselect.createSelector)(cities, function (cities) {
  return {
    cities: cities.map(function (city) {
      return { key: city, value: city };
    }).toJS()
  };
});
exports.citiesSelector = citiesSelector;
//# sourceMappingURL=cities.js.map
