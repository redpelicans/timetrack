'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _mongobless = require('mongobless');

var _mongobless2 = _interopRequireDefault(_mongobless);

var Mission = (function () {
  function Mission() {
    _classCallCheck(this, _Mission);
  }

  _createClass(Mission, null, [{
    key: 'loadOne',
    value: function loadOne(id, cb) {
      Mission.findOne({ isDeleted: { $ne: true }, _id: id }, function (err, mission) {
        if (err) return cb(err);
        cb(null, mission);
      });
    }
  }]);

  var _Mission = Mission;
  Mission = (0, _mongobless2['default'])({ collection: 'missions' })(Mission) || Mission;
  return Mission;
})();

exports['default'] = Mission;
module.exports = exports['default'];
//# sourceMappingURL=mission.js.map
