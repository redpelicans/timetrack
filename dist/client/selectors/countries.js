'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _reselect = require('reselect');

var countries = function countries(state) {
  return state.countries;
};

var countriesSelector = (0, _reselect.createSelector)(countries, function (countries) {
  return {
    countries: countries.map(function (country) {
      return { key: country, value: country };
    }).toJS()
  };
});
exports.countriesSelector = countriesSelector;
//# sourceMappingURL=countries.js.map
