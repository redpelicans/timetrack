'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.loadCountries = loadCountries;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var COUNTRIES_LOADED = 'COUNTRIES_LOADED';

exports.COUNTRIES_LOADED = COUNTRIES_LOADED;
function countriesLoaded(countries) {
  return {
    type: COUNTRIES_LOADED,
    countries: _immutable2['default'].fromJS(countries)
  };
}

function loadCountries() {
  return function (dispatch, getState) {
    (0, _utils.requestJson)('/api/countries', dispatch, getState, { message: 'Cannot load countries, check your backend server' }).then(function (countries) {
      return dispatch(countriesLoaded(countries));
    });
  };
}

var countriesActions = {
  load: loadCountries
};
exports.countriesActions = countriesActions;
//# sourceMappingURL=countries.js.map
