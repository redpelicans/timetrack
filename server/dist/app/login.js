'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.init = init;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _models = require('../models');

var _helpers = require('../helpers');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _njwt = require('njwt');

var _njwt2 = _interopRequireDefault(_njwt);

var TOKENINFO = "https://www.googleapis.com/oauth2/v3/tokeninfo";

function init(app, resources, params) {
  app.post('/login', function (req, res, next) {
    var id_token = req.body.id_token;
    if (!id_token) setImmediate(next, new Error("Cannot login without a token!"));
    _async2['default'].waterfall([checkGoogleUser.bind(null, id_token), loadUser, updateAvatar], function (err, user) {
      if (err) return next(err);
      var expirationDate = (0, _moment2['default'])().add(params.sessionDuration || 8, 'hours').toDate();
      var token = getToken(user, params.secretKey, expirationDate);
      res.json({ user: user, token: token });
    });
  });

  function checkGoogleUser(token, cb) {
    var clientId = params.google && params.google.clientId;
    (0, _request2['default'])({
      method: 'GET',
      uri: TOKENINFO + ('?id_token=' + token),
      json: true,
      timeout: 1000
    }, function (error, response, body) {
      if (error || response.statusCode !== 200) return cb(error);
      if (body.aud !== clientId) return cb(new Error("Wrong Google token_id!"));
      cb(null, body);
    });
  }
}

function loadUser(googleUser, cb) {
  _models.Person.findOne({ isDeleted: { $ne: true }, email: googleUser.email }, function (err, user) {
    if (err) return cb(err);
    if (!user) return cb(new Error("Unknwon email: " + googleUser.email));
    cb(null, user, googleUser);
  });
}

function updateAvatar(user, googleUser, cb) {
  if (!googleUser.picture || user.avatar && user.avatar.url === googleUser.picture) return setImmediate(cb, null, user);
  _models.Person.collection.updateOne({ _id: user._id }, { $set: { 'avatar.avatarType': 'url', 'avatar.url': googleUser.picture } }, function (err) {
    cb(err, user);
  });
}

function getToken(user, secretKey, expirationDate) {
  var claims = {
    sub: user._id.toString(),
    iss: 'http://timetrack.repelicans.com'
  };
  var jwt = _njwt2['default'].create(claims, secretKey);
  jwt.setExpiration(expirationDate);
  return jwt.compact();
}
//# sourceMappingURL=login.js.map
