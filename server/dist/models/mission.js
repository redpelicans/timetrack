'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mongobless = require('mongobless');

var _mongobless2 = _interopRequireDefault(_mongobless);

var Mission = (function () {
  function Mission() {
    _classCallCheck(this, _Mission);
  }

  var _Mission = Mission;
  Mission = (0, _mongobless2['default'])({ collection: 'missions' })(Mission) || Mission;
  return Mission;
})();

exports['default'] = Mission;
module.exports = exports['default'];

// @atttributes:
//   _id {ObjectId}
//   label {String}
//   startDate {Date}
//   endDate {Date}
//   companyId {ObjectId}
//# sourceMappingURL=mission.js.map
