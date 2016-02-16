'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _mongobless = require('mongobless');

var _mongobless2 = _interopRequireDefault(_mongobless);

var oAuth2Client = (function () {
    function oAuth2Client() {
        _classCallCheck(this, _oAuth2Client);
    }

    var _oAuth2Client = oAuth2Client;
    oAuth2Client = (0, _mongobless2['default'])({ collection: 'oAuth2Clients' })(oAuth2Client) || oAuth2Client;
    return oAuth2Client;
})();

exports.oAuth2Client = oAuth2Client;

var oAuth2AccessToken = (function () {
    function oAuth2AccessToken() {
        _classCallCheck(this, _oAuth2AccessToken);
    }

    var _oAuth2AccessToken = oAuth2AccessToken;
    oAuth2AccessToken = (0, _mongobless2['default'])({ collection: 'oAuth2AccessTokens' })(oAuth2AccessToken) || oAuth2AccessToken;
    return oAuth2AccessToken;
})();

exports.oAuth2AccessToken = oAuth2AccessToken;

var oAuth2RefreshToken = (function () {
    function oAuth2RefreshToken() {
        _classCallCheck(this, _oAuth2RefreshToken);
    }

    var _oAuth2RefreshToken = oAuth2RefreshToken;
    oAuth2RefreshToken = (0, _mongobless2['default'])({ collection: 'oAuth2RefreshToken' })(oAuth2RefreshToken) || oAuth2RefreshToken;
    return oAuth2RefreshToken;
})();

exports.oAuth2RefreshToken = oAuth2RefreshToken;
//# sourceMappingURL=oauth2.js.map
