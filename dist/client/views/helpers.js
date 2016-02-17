'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.timeLabels = timeLabels;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function timeLabels(obj) {
  if (!obj || !obj.createdAt) return _react2['default'].createElement('span', null);
  var res = ['Created ' + obj.createdAt.fromNow()];
  if (obj.updatedAt) res.push('Updated ' + obj.updatedAt.fromNow());

  return _react2['default'].createElement(
    'span',
    null,
    res.join(' - ')
  );
}
//# sourceMappingURL=helpers.js.map
