'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactRouter = require('react-router');

var _containersRoot = require('./containers/root');

var _containersRoot2 = _interopRequireDefault(_containersRoot);

var _containersApp = require('./containers/app');

var _containersApp2 = _interopRequireDefault(_containersApp);

var _actionsLogin = require('./actions/login');

var _actionsSitemap = require('./actions/sitemap');

var _auths = require('./auths');

var _auths2 = _interopRequireDefault(_auths);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _boot = require('./boot');

var _boot2 = _interopRequireDefault(_boot);

var _socketIO = require('./socketIO');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _reactWidgetsLibLocalizersMoment = require('react-widgets/lib/localizers/moment');

var _reactWidgetsLibLocalizersMoment2 = _interopRequireDefault(_reactWidgetsLibLocalizersMoment);

var _storeConfigureStore = require('./store/configureStore');

var _storeConfigureStore2 = _interopRequireDefault(_storeConfigureStore);

require('react-widgets/lib/less/react-widgets.less');

require('../../public/styles/app.less');

(0, _reactWidgetsLibLocalizersMoment2['default'])(_moment2['default']);

var store = (0, _storeConfigureStore2['default'])();
(0, _socketIO.registerSocketIO)(store);
var authManager = (0, _auths2['default'])(store);

function onEnter(nextState, replace) {
  console.log("===> ENTER ROUTE: " + this.path);
  var state = store.getState();
  if (this.isAuthRequired() && !state.login.user) return replace(_routes2['default'].login.path, null, { nextRouteName: this.fullName });
  if (!authManager.isAuthorized(this)) return replace(_routes2['default'].unauthorized.path);
  store.dispatch(_actionsSitemap.sitemapActions.enter(this));
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

var defaultRoute = _routes2['default'].defaultRoute;

var routes = _react2['default'].createElement(
  _reactRouter.Route,
  { path: '/', component: _containersApp2['default'] },
  _react2['default'].createElement(_reactRouter.IndexRoute, { component: defaultRoute.component, onEnter: onEnter.bind(defaultRoute) }),
  getRoutes(_routes2['default'].routes),
  _react2['default'].createElement(_reactRouter.Route, { path: '*', component: _routes2['default'].notfound.component })
);

(0, _boot2['default'])().then(function () {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var user = _ref.user;
  var jwt = _ref.jwt;

  console.log("End of boot process.");
  console.log("Rendering react App...");
  if (user) store.dispatch((0, _actionsLogin.loggedIn)(user, jwt));
  (0, _reactDom.render)(_react2['default'].createElement(_containersRoot2['default'], { store: store, routes: routes, history: _reactRouter.browserHistory, authManager: authManager }), document.getElementById("timetrackApp"));
});
// .catch( (err) => {
//   console.log(err)
//   const elt = document.getElementById("bootmessage");
//   elt.className="alert alert-danger boot-error";
//   elt.innerText = 'Runtime error, check your backend';
// });
//# sourceMappingURL=index.js.map
