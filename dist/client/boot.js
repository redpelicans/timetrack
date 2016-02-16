'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = boot;

var _utils = require('./utils');

function boot() {
  var jwt = localStorage.getItem('access_token');

  if (!jwt) return new Promise(function (resolve) {
    return resolve();
  });

  var options = {
    headers: {
      'X-Token-Access': jwt
    }
  };

  return fetch('/user', options).then(function (res) {
    if (res.status >= 200 && res.status < 300) {
      return res.json().then(function (user) {
        console.log("Already logged");
        return { user: user, jwt: jwt };
      });
    } else {
      return;
    }
  });
}

module.exports = exports['default'];
//# sourceMappingURL=boot.js.map
