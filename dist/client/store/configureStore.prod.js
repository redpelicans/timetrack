'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = configureStore;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _reactRouter = require('react-router');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var finalCreateStore = (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2['default'], (0, _reactRouterRedux.syncHistory)(_reactRouter.browserHistory)))(_redux.createStore);

function configureStore(initialState) {
  return finalCreateStore(_reducers2['default'], initialState);
}

module.exports = exports['default'];
//# sourceMappingURL=configureStore.prod.js.map
