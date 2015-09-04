'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var spawn = require('child_process').spawn;

// goody to display current git hash
exports['default'] = { init: init };

function init() {
  return function (cb) {
    var cmd = spawn('git', ['log', '-1', '--format="%h"']),
        error,
        version;

    cmd.stdout.on('data', function (data) {
      version = data.toString().replace(/(\n$|\")/g, '');
    });

    cmd.stderr.on('data', function (data) {
      error = data.toString();
    });

    cmd.on('close', function (code) {
      //if(code != 0) return cb(new Error(error));
      // may we are not in a git folder !!
      if (code != 0) {
        console.error(error);
        return cb();
      }
      cb(null, version);
    });
  };
}
module.exports = exports['default'];
//# sourceMappingURL=../init/githash.js.map