'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _mongobless = require('mongobless');

var _mongobless2 = _interopRequireDefault(_mongobless);

var _oauth2 = require('./oauth2');

var User = (function () {
    function User() {
        _classCallCheck(this, _User);
    }

    _createClass(User, null, [{
        key: 'getAccessToken',
        value: function getAccessToken(bearerToken, callback) {
            console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

            _oauth2.oAuth2AccessToken.findOne({ accessToken: bearerToken }, callback);
        }
    }, {
        key: 'getClient',
        value: function getClient(clientId, clientSecret, callback) {
            console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');

            if (clientSecret === null) {
                return _oauth2.oAuth2Client.findOne({ clientId: clientId }, callback);
            }

            _oauth2.oAuth2Client.findOne({ id: clientId, secret: clientSecret }, function (err, client) {
                if (err) return callback(err);
                client.clientId = client.id;
                callback(null, client);
            });
        }
    }, {
        key: 'grantTypeAllowed',
        value: function grantTypeAllowed(clientId, grantType, callback) {
            console.log('in grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');

            if (grantType === 'password' || grantType === 'refresh_token') {
                _oauth2.oAuth2Client.findOne({ id: clientId, grant_types: grantType }, function (err, client) {
                    if (err) return callback(err);

                    if (client.id == clientId) {
                        callback(false, true);
                    } else {
                        callback(false, false);
                    }
                });
            } else {
                callback(false, false);
            }
        }
    }, {
        key: 'saveAccessToken',
        value: function saveAccessToken(accessToken, clientId, expires, user, callback) {
            console.log('in saveAccessToken (token: ' + accessToken + ', clientId: ' + clientId + ', userId: ' + user.id + ', expires: ' + expires + ')');

            var token = { accessToken: accessToken, clientId: clientId, expires: expires, userId: user.id };

            _oauth2.oAuth2AccessToken.collection.insert(token, callback);
        }
    }, {
        key: 'saveRefreshToken',
        value: function saveRefreshToken(token, clientId, expires, user, callback) {
            console.log('in saveRefreshToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + user.id + ', expires: ' + expires + ')');

            var refreshToken = {
                refreshToken: token,
                clientId: clientId,
                userId: user.id,
                expires: expires
            };

            _oauth2.oAuth2RefreshToken.collection.insert(refreshToken, callback);
        }
    }, {
        key: 'getRefreshToken',
        value: function getRefreshToken(refreshToken, callback) {
            console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

            _oauth2.oAuth2RefreshToken.findOne({ refreshToken: refreshToken }, callback);
        }
    }, {
        key: 'getUser',
        value: function getUser(username, password, callback) {
            console.log('in getUser (username: ' + username + ', password: ' + password + ')');
            User.findOne({ username: username, password: password }, function (err, user) {
                if (err) return callback(err);
                user.id = user._id + "";
                callback(null, user);
            });
        }
    }]);

    var _User = User;
    User = (0, _mongobless2['default'])({ collection: 'users' })(User) || User;
    return User;
})();

exports.User = User;
//# sourceMappingURL=users.js.map
