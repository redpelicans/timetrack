'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _params = require('../../params');

var _params2 = _interopRequireDefault(_params);

var _index = require('./index');

var server = _interopRequireWildcard(_index);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

require('better-log').install();

var logerror = (0, _debug2['default'])('timetrack:error'),
    loginfo = (0, _debug2['default'])('timetrack:info');

server.create(_params2['default']).then(function (transac) {
  loginfo('ready to track time with U ...');
})['catch'](function (err) {
  throw err;
});
//# sourceMappingURL=main.js.map