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

var AuthManager = (function (_Component) {
  _inherits(AuthManager, _Component);

  _createClass(AuthManager, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        authManager: this.manager,
        dispatch: this.dispatch
      };
    }
  }]);

  function AuthManager(props, context) {
    _classCallCheck(this, AuthManager);

    _get(Object.getPrototypeOf(AuthManager.prototype), 'constructor', this).call(this, props, context);
    this.manager = props.manager;
    this.dispatch = context.store.dispatch;
  }

  _createClass(AuthManager, [{
    key: 'render',
    value: function render() {
      var children = this.props.children;

      return _react.Children.only(children);
    }
  }]);

  return AuthManager;
})(_react.Component);

exports['default'] = AuthManager;

AuthManager.childContextTypes = {
  authManager: _react.PropTypes.object.isRequired,
  dispatch: _react.PropTypes.func.isRequired
};

AuthManager.propTypes = {
  manager: _react.PropTypes.object.isRequired,
  children: _react.PropTypes.element.isRequired
};

AuthManager.contextTypes = {
  store: _react.PropTypes.object
};

var authable = function authable(Component) {
  Component.contextTypes = {
    authManager: _react.PropTypes.object,
    dispatch: _react.PropTypes.func
  };

  return function (props) {
    return _react2['default'].createElement(Component, props);
  };
};
exports.authable = authable;
//# sourceMappingURL=authmanager.js.map
