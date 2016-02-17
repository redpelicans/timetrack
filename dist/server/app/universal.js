'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDomServer = require('react-dom/server');

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _clientReducers = require('../../client/reducers');

var _clientReducers2 = _interopRequireDefault(_clientReducers);

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _clientComponentsAuthmanager = require('../../client/components/authmanager');

var _clientComponentsAuthmanager2 = _interopRequireDefault(_clientComponentsAuthmanager);

var _clientContainersApp = require('../../client/containers/app');

var _clientContainersApp2 = _interopRequireDefault(_clientContainersApp);

var _clientActionsLogin = require('../../client/actions/login');

var _clientActionsSitemap = require('../../client/actions/sitemap');

var _clientAuths = require('../../client/auths');

var _clientAuths2 = _interopRequireDefault(_clientAuths);

var _clientRoutes = require('../../client/routes');

var _clientRoutes2 = _interopRequireDefault(_clientRoutes);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _reactWidgetsLibLocalizersMoment = require('react-widgets/lib/localizers/moment');

var _reactWidgetsLibLocalizersMoment2 = _interopRequireDefault(_reactWidgetsLibLocalizersMoment);

(0, _reactWidgetsLibLocalizersMoment2['default'])(_moment2['default']);

var store = (0, _redux.createStore)(_clientReducers2['default'], undefined, (0, _redux.applyMiddleware)(_reduxThunk2['default']));
var authManager = (0, _clientAuths2['default'])(store);

function onEnter(nextState, replace) {
  console.log("===> ENTER ROUTE: " + this.path);
  var state = store.getState();
  if (this.isAuthRequired() && !state.login.user) return replace(_clientRoutes2['default'].login.path, null, { nextRouteName: this.fullName });
  if (!authManager.isAuthorized(this)) return replace(_clientRoutes2['default'].unauthorized.path);
  store.dispatch(_clientActionsSitemap.sitemapActions.enter(this));
}

function onLeave(location) {
  console.log("===> LEAVE ROUTE: " + this.topic);
}

function getRoutes(routes) {
  return routes.filter(function (r) {
    return r.path;
  }).map(function (r) {
    return _react2['default'].createElement(_reactRouter.Route, {
      topic: r.topic,
      onEnter: onEnter.bind(r),
      //onLeave={onLeave.bind(r)}
      key: r.path,
      path: r.path,
      component: r.component });
  });
}

var defaultRoute = _clientRoutes2['default'].defaultRoute;

var routes = _react2['default'].createElement(
  _reactRouter.Route,
  { path: '/', component: _clientContainersApp2['default'] },
  _react2['default'].createElement(_reactRouter.IndexRoute, { component: defaultRoute.component, onEnter: onEnter.bind(defaultRoute) }),
  getRoutes(_clientRoutes2['default'].routes),
  _react2['default'].createElement(_reactRouter.Route, { path: '*', component: _clientRoutes2['default'].notfound.component })
);

var Root = function Root(_ref) {
  var store = _ref.store;
  var authManager = _ref.authManager;
  var renderProps = _ref.renderProps;

  return _react2['default'].createElement(
    _reactRedux.Provider,
    { store: store },
    _react2['default'].createElement(
      _clientComponentsAuthmanager2['default'],
      { manager: authManager },
      _react2['default'].createElement(_reactRouter.RouterContext, renderProps)
    )
  );
};

function init(app, resources) {
  app.get('*', function (req, res) {
    (0, _reactRouter.match)({ routes: routes, location: req.url }, function (error, redirectLocation, renderProps) {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        var reactOutput = (0, _reactDomServer.renderToString)(_react2['default'].createFactory(Root)({ store: store, authManager: authManager, renderProps: renderProps }));
        res.render('index.ejs', { reactOutput: reactOutput });
      } else {
        res.status(404).send('Not found');
      }
    });
  });
}
//# sourceMappingURL=universal.js.map
