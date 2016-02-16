'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _layout = require('./layout');

var UnAuthorized = function UnAuthorized() {
  var styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '10%'
    }
  };

  return _react2['default'].createElement(
    _layout.Content,
    null,
    _react2['default'].createElement(
      'div',
      { style: styles.container },
      _react2['default'].createElement(
        'h3',
        null,
        'Sorry but previous action is unauthorized '
      ),
      ';'
    )
  );
};

exports['default'] = UnAuthorized;
module.exports = exports['default'];
//# sourceMappingURL=unauthorized.js.map
