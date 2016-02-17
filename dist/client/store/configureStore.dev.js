'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = configureStore;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _reactRouter = require('react-router');

var _containersDevTools = require('../containers/dev-tools');

var _containersDevTools2 = _interopRequireDefault(_containersDevTools);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var reduxRouterMiddleware = (0, _reactRouterRedux.syncHistory)(_reactRouter.browserHistory);

function configureStore(initialState) {
  var store = (0, _redux.createStore)(_reducers2['default'], initialState, (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2['default'], reduxRouterMiddleware, (0, _reduxLogger2['default'])()), window.devToolsExtension ? window.devToolsExtension() : _containersDevTools2['default'].instrument()));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', function () {
      var nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

module.exports = exports['default'];
//# sourceMappingURL=configureStore.dev.js.map
