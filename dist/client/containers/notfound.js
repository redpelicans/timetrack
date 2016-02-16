'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _componentsLayout = require('../components/layout');

var _reactRedux = require('react-redux');

var _actionsRoutes = require('../actions/routes');

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

var NotFound = function NotFound(_ref) {
  var user = _ref.user;
  var dispatch = _ref.dispatch;

  if (user) dispatch((0, _actionsRoutes.replaceRoute)(_routes2['default'].defaultRoute));

  var styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '10%'
    }
  };

  return _react2['default'].createElement(
    _componentsLayout.Content,
    null,
    _react2['default'].createElement(
      'div',
      { style: styles.container },
      _react2['default'].createElement(
        'h3',
        null,
        'Sorry but you seems to be lost, current page is unknown '
      )
    )
  );
};

NotFound.propTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  user: _react.PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.login.user
  };
}
exports['default'] = (0, _reactRedux.connect)(mapStateToProps)(NotFound);
module.exports = exports['default'];
//# sourceMappingURL=notfound.js.map
