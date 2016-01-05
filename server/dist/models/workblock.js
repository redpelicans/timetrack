'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mongobless = require('mongobless');

var _mongobless2 = _interopRequireDefault(_mongobless);

var Workblock = (function () {
  function Workblock() {
    _classCallCheck(this, _Workblock);
  }

  var _Workblock = Workblock;
  Workblock = (0, _mongobless2['default'])({ collection: 'workblocks' })(Workblock) || Workblock;
  return Workblock;
})();

exports['default'] = Workblock;
module.exports = exports['default'];

// @atttributes:
//   _id {ObjectId}
//   description {String}
//   unit {String}
//   quantity {Float}
//   status {String}
//   startTime {Datetime}
//   missionId {ObjectId}
//# sourceMappingURL=workblock.js.map
