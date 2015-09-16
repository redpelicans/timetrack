'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _mongobless = require('mongobless');

var _mongobless2 = _interopRequireDefault(_mongobless);

var NotFoundError = (function (_Error) {
  _inherits(NotFoundError, _Error);

  function NotFoundError() {
    _classCallCheck(this, NotFoundError);

    _get(Object.getPrototypeOf(NotFoundError.prototype), 'constructor', this).apply(this, arguments);
  }

  return NotFoundError;
})(Error);

var FMT = 'DD/MM/YYYY';
function dmy(date) {
  return (0, _moment2['default'])(date).format(FMT);
}

dmy.FMT = FMT;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.NotFoundError = NotFoundError;
exports.dmy = dmy;
exports.FMT = FMT;
exports.getRandomInt = getRandomInt;
exports.ObjectId = _mongobless.ObjectId;
//# sourceMappingURL=../helpers/index.js.map