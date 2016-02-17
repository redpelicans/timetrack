'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.rndColor = rndColor;
exports.avatartarUrlValueChecker = avatartarUrlValueChecker;
exports.emailUniqueness = emailUniqueness;

var _utils = require('../utils');

var colors = ['#d73d32', '#CD4436', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080'];

exports.colors = colors;
var avatarTypes = [{ key: 'color', value: 'Color Picker' }, { key: 'url', value: 'Logo URL' }, { key: 'src', value: 'Logo File' }];

exports.avatarTypes = avatarTypes;

function rndColor() {
  var index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

function avatartarUrlValueChecker(url, state) {
  if (!url) return new Promise(function (resolve) {
    return resolve({ checked: true });
  });
  return (0, _utils.requestJson)('/api/check_url', undefined, undefined, { verb: 'post', body: { url: url } }).then(function (res) {
    return {
      checked: res.ok,
      error: !res.ok && "Wrong URL!"
    };
  });
}

function emailUniqueness(email) {
  var person = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (!email || person.email === email) return new Promise(function (resolve) {
    return resolve({ checked: true });
  });
  return (0, _utils.requestJson)('/api/person/check_email_uniqueness', undefined, undefined, { verb: 'post', body: { email: email } }).then(function (res) {
    return {
      checked: res.ok,
      error: !res.ok && "Email already exists!"
    };
  });
}
//# sourceMappingURL=helpers.js.map
