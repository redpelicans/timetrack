'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactToastr = require('react-toastr');

var _reactToastr2 = _interopRequireDefault(_reactToastr);

var _reactRedux = require('react-redux');

var _actionsLogin = require('../actions/login');

var _actionsRoutes = require('../actions/routes');

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

var _componentsWidgets = require('../components/widgets');

var ToastContainer = _reactToastr2['default'].ToastContainer;

var ToastMessageFactory = _react2['default'].createFactory(_reactToastr2['default'].ToastMessage.animation);

//import injecttapeventplugin from 'react-tap-event-plugin';
//injecttapeventplugin();
//
//

var App = (function (_Component) {
  _inherits(App, _Component);

  function App() {
    var _this = this;

    _classCallCheck(this, App);

    _get(Object.getPrototypeOf(App.prototype), 'constructor', this).apply(this, arguments);

    this.handleGoHome = function () {
      _this.props.dispatch(_actionsRoutes.routeActions.push(_routes2['default'].defaultRoute));
    };

    this.handleLogout = function () {
      _this.props.dispatch((0, _actionsLogin.logout)());
    };

    this.handleGotoRoute = function (route) {
      _this.props.dispatch(_actionsRoutes.routeActions.push(route));
    };

    this.handleViewPerson = function () {
      _this.props.dispatch(_actionsRoutes.routeActions.push({
        pathname: _routes2['default'].person.view,
        state: { personId: _this.props.user.get('_id') }
      }));
    };
  }

  _createClass(App, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.errorMessage.message && nextProps.errorMessage.message != this.props.errorMessage.message) {
        var _nextProps$errorMessage = nextProps.errorMessage;
        var message = _nextProps$errorMessage.message;
        var header = _nextProps$errorMessage.header;

        this.refs.container.error(message, header, {
          closeButton: true,
          showDuration: 300,
          hideDuration: 1000,
          timeOut: 5000,
          extendedTimeOut: 1000,
          tapToDismiss: true
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var user = _props.user;
      var currentTopic = _props.currentTopic;

      var styles = {
        toast: {
          position: 'fixed',
          zIndex: 9999,
          pointerEvents: 'None',
          top: '100px',
          right: '12px'
        }
      };
      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(AppNav, {
          user: user,
          onGoHome: this.handleGoHome,
          onLogout: this.handleLogout,
          onViewPerson: this.handleViewPerson,
          gotoRoute: this.handleGotoRoute,
          currentTopic: currentTopic }),
        _react2['default'].createElement(
          'div',
          { className: 'm-t-70 container-fluid' },
          _react2['default'].createElement(
            'div',
            { className: 'row m-t' },
            this.props.children
          ),
          _react2['default'].createElement(ToastContainer, {
            style: styles.toast,
            ref: 'container',
            toastMessageFactory: ToastMessageFactory })
        )
      );
    }
  }]);

  return App;
})(_react.Component);

App.propTypes = {
  user: _react.PropTypes.object,
  errorMessage: _react.PropTypes.object,
  currentTopic: _react.PropTypes.string,
  dispatch: _react.PropTypes.func.isRequired
};

var AppNav = function AppNav(_ref) {
  var user = _ref.user;
  var onGoHome = _ref.onGoHome;
  var onLogout = _ref.onLogout;
  var onViewPerson = _ref.onViewPerson;
  var currentTopic = _ref.currentTopic;
  var gotoRoute = _ref.gotoRoute;

  var collapseMenu = function collapseMenu() {
    $('#collapsingNavbar').collapse('toggle');
  };

  var handleLogout = function handleLogout(e) {
    e.preventDefault();
    onLogout();
  };

  var handleViewPerson = function handleViewPerson(e) {
    e.preventDefault();
    onViewPerson();
  };

  var handleGoHome = function handleGoHome(e) {
    e.preventDefault();
    onGoHome();
  };

  var menu1 = function menu1() {
    if (!user) return [];
    return _routes2['default'].routes.filter(function (route) {
      return route.isMenu;
    }).sort(function (a, b) {
      return a.isMenu > b.isMenu;
    }).map(function (e) {
      return _react2['default'].createElement(AppNavItem, { key: e.topic, gotoRoute: gotoRoute, route: e, currentTopic: currentTopic });
    });
  };

  var menu2 = function menu2() {
    if (!user) return [];
    return _routes2['default'].routes.filter(function (route) {
      return route.isMenu;
    }).sort(function (a, b) {
      return a.isMenu > b.isMenu;
    }).map(function (e) {
      return _react2['default'].createElement(AppMobileNavItem, { collapse: collapseMenu, key: e.topic, gotoRoute: gotoRoute, route: e, currentTopic: currentTopic });
    });
  };

  var avatarBtn = function avatarBtn() {
    if (!user) return _react2['default'].createElement('div', null);
    return _react2['default'].createElement(
      'form',
      { className: 'form-inline navbar-form pull-right' },
      _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(
          'button',
          { className: 'tm avatar-button', type: 'button', id: 'avatarmenu', 'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'true' },
          _react2['default'].createElement(_componentsWidgets.AvatarView, { obj: user })
        ),
        _react2['default'].createElement(
          'ul',
          { className: 'dropdown-menu dropdown-menu-right', 'aria-labelledby': 'avatarmenu' },
          _react2['default'].createElement(
            'h6',
            { className: 'dropdown-header' },
            user.get('email')
          ),
          _react2['default'].createElement(
            'a',
            { className: 'dropdown-item', href: '#', onClick: handleViewPerson },
            'View Profile'
          ),
          _react2['default'].createElement(
            'a',
            { className: 'dropdown-item', href: '#', onClick: handleLogout },
            'Logout'
          )
        )
      )
    );
  };

  var styles = {
    dropdownMenuItem: {
      color: '#cfd2da',
      paddingLeft: '20px'
    },
    logo: {
      color: "#cd4436"
    }
  };

  return _react2['default'].createElement(
    'div',
    null,
    _react2['default'].createElement(
      'div',
      { className: 'm-t-70 collapse hidden-md-up bg-inverse p-a', id: 'collapsingNavbar' },
      _react2['default'].createElement(
        'ul',
        { className: 'nav nav-pills nav-stacked' },
        menu2()
      )
    ),
    _react2['default'].createElement(
      'nav',
      { className: 'navbar navbar-fixed-top navbar-dark bg-inverse tm header black' },
      _react2['default'].createElement(
        'button',
        { className: 'p-a navbar-toggler hidden-md-up tm mobile button', type: 'button', 'data-toggle': 'collapse', 'data-target': '#collapsingNavbar' },
        _react2['default'].createElement(
          'span',
          { className: 'm-r-1' },
          '☰'
        ),
        _react2['default'].createElement(
          'span',
          { className: 'tm mobile header' },
          'Timetrack by redpelicans'
        )
      ),
      _react2['default'].createElement(
        'div',
        { className: 'collapse navbar-toggleable-sm' },
        _react2['default'].createElement(
          'a',
          { className: 'navbar-brand tm brand', href: '#', onClick: handleGoHome },
          _react2['default'].createElement('i', { style: styles.logo, className: 'fa fa-paper-plane m-r-1' }),
          'Timetrack by redpelicans'
        ),
        _react2['default'].createElement(
          'ul',
          { className: 'nav navbar-nav tm menu item' },
          menu1()
        ),
        avatarBtn()
      )
    )
  );
};

AppNav.propTypes = {
  user: _react.PropTypes.object,
  currentTopic: _react.PropTypes.string,
  onGoHome: _react.PropTypes.func.isRequired,
  onLogout: _react.PropTypes.func.isRequired,
  onViewPerson: _react.PropTypes.func.isRequired,
  gotoRoute: _react.PropTypes.func.isRequired
};

var AppNavItem = function AppNavItem(_ref2) {
  var gotoRoute = _ref2.gotoRoute;
  var route = _ref2.route;
  var currentTopic = _ref2.currentTopic;

  var handleClick = function handleClick(e) {
    e.preventDefault();
    gotoRoute(route);
  };

  var style = route.topic === currentTopic ? { borderBottomColor: '#1ca8dd !important', borderBottomStyle: 'solid' } : {};

  return _react2['default'].createElement(
    'li',
    { className: 'nav-item' },
    _react2['default'].createElement(
      'a',
      { style: style, className: 'nav-link', href: '#', onClick: handleClick },
      _react2['default'].createElement(
        'span',
        null,
        route.label
      )
    )
  );
};

AppNavItem.propTypes = {
  route: _react.PropTypes.object.isRequired,
  gotoRoute: _react.PropTypes.func.isRequired,
  currentTopic: _react.PropTypes.string
};

var AppMobileNavItem = function AppMobileNavItem(_ref3) {
  var gotoRoute = _ref3.gotoRoute;
  var route = _ref3.route;
  var currentTopic = _ref3.currentTopic;
  var collapse = _ref3.collapse;

  var handleClick = function handleClick(e) {
    e.preventDefault();
    collapse();
    gotoRoute(route);
  };

  var styles = {
    icon: {
      color: route.topic === currentTopic ? "#1ca8dd" : ""
    }
  };
  return _react2['default'].createElement(
    'li',
    { className: 'nav-item' },
    _react2['default'].createElement(
      'a',
      { className: 'nav-link', href: '#', onClick: handleClick },
      _react2['default'].createElement('i', { className: 'fa fa-' + route.iconName + ' m-a-1', style: styles.icon }),
      route.label
    )
  );
};

AppMobileNavItem.propTypes = {
  route: _react.PropTypes.object.isRequired,
  currentTopic: _react.PropTypes.string,
  collapse: _react.PropTypes.func.isRequired,
  gotoRoute: _react.PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    errorMessage: state.error,
    user: state.login.user,
    currentTopic: state.sitemap.currentRoute && state.sitemap.currentRoute.topic
  };
}

exports['default'] = (0, _reactRedux.connect)(mapStateToProps)(App);
module.exports = exports['default'];
//# sourceMappingURL=app.js.map
