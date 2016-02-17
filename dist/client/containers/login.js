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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _viewsLayout = require('../views/layout');

var _reactRedux = require('react-redux');

var _actionsLogin = require('../actions/login');

var _actionsRoutes = require('../actions/routes');

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

var LoginApp = (function (_Component) {
  _inherits(LoginApp, _Component);

  function LoginApp() {
    _classCallCheck(this, LoginApp);

    _get(Object.getPrototypeOf(LoginApp.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(LoginApp, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (this.props.user) {
        this.props.dispatch((0, _actionsRoutes.replaceRoute)(_routes2['default'].defaultRoute));
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      gapi.load('auth2', function () {
        var auth2 = gapi.auth2.getAuthInstance();
        if (!auth2) {
          auth2 = gapi.auth2.init({
            client_id: "1013003508849-ke0dsjttftqcl0ee3jl7nv7av9iuij8p.apps.googleusercontent.com"
          });
        }

        var onFailure = function onFailure(err) {
          //console.log(err)
        };

        var onSuccess = function onSuccess(user) {
          var _props = _this.props;
          var dispatch = _props.dispatch;
          var login = _props.login;

          console.log('Signed in as ' + user.getBasicProfile().getEmail());
          var nextRouteName = _this.props.location.state && _this.props.location.state.nextRouteName;
          dispatch((0, _actionsLogin.loginRequest)(user, nextRouteName));
        };

        auth2.attachClickHandler('signin-button', {}, onSuccess, onFailure);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var styles = {
        container: {
          display: 'flex',
          justifyContent: 'center',
          marginTop: '10%'
        }
      };

      return _react2['default'].createElement(
        _viewsLayout.Content,
        null,
        _react2['default'].createElement(
          'div',
          { style: styles.container },
          _react2['default'].createElement(
            'a',
            { href: '#', id: 'signin-button' },
            _react2['default'].createElement('img', { src: '/images/sign-in-with-google.png' })
          )
        )
      );
    }
  }]);

  return LoginApp;
})(_react.Component);

exports['default'] = LoginApp;

LoginApp.propTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  user: _react.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user
  };
}
exports['default'] = (0, _reactRedux.connect)(mapStateToProps)(LoginApp);
module.exports = exports['default'];
//# sourceMappingURL=login.js.map
