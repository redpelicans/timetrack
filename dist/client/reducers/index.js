'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _errors = require('./errors');

var _errors2 = _interopRequireDefault(_errors);

var _socketIO = require('./socketIO');

var _socketIO2 = _interopRequireDefault(_socketIO);

var _sitemap = require('./sitemap');

var _sitemap2 = _interopRequireDefault(_sitemap);

var _companies = require('./companies');

var _companies2 = _interopRequireDefault(_companies);

var _persons = require('./persons');

var _persons2 = _interopRequireDefault(_persons);

var _missions = require('./missions');

var _missions2 = _interopRequireDefault(_missions);

var _loading = require('./loading');

var _loading2 = _interopRequireDefault(_loading);

var _cities = require('./cities');

var _cities2 = _interopRequireDefault(_cities);

var _countries = require('./countries');

var _countries2 = _interopRequireDefault(_countries);

var _tags = require('./tags');

var _tags2 = _interopRequireDefault(_tags);

var _notes = require('./notes');

var _notes2 = _interopRequireDefault(_notes);

var _skills = require('./skills');

var _skills2 = _interopRequireDefault(_skills);

var rootReducer = (0, _redux.combineReducers)({
    routing: _reactRouterRedux.routeReducer,
    login: _login2['default'],
    socketIO: _socketIO2['default'],
    error: _errors2['default'],
    sitemap: _sitemap2['default'],
    companies: _companies2['default'],
    persons: _persons2['default'],
    missions: _missions2['default'],
    cities: _cities2['default'],
    countries: _countries2['default'],
    tags: _tags2['default'],
    notes: _notes2['default'],
    skills: _skills2['default'],
    pendingRequests: _loading2['default']
});

exports['default'] = rootReducer;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
