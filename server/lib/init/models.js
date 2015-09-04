'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongobless = require('mongobless');

var _mongobless2 = _interopRequireDefault(_mongobless);

// load models

require('../models');

var _ = require('lodash'),
    debug = require('debug')('timetrack:models');

function init(params) {
  return function (cb) {
    _mongobless2['default'].connect(_.extend({ verbose: false }, params), function (err) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      debug('Timetrack models are ready to help you ...');
      cb(err, _mongobless2['default']);
    });
  };
}

module.exports = exports['default'];
//# sourceMappingURL=../init/models.js.map