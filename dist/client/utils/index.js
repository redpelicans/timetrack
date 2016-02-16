'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.parseJSON = parseJSON;
exports.checkStatus = checkStatus;
exports.requestJson = requestJson;
exports.fetchJson = fetchJson;

var _actionsErrors = require('../actions/errors');

var _actionsLoading = require('../actions/loading');

var _actionsRoutes = require('../actions/routes');

var _actionsLogin = require('../actions/login');

function parseJSON(res) {
  return res.json && res.json() || res;
}

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else if (res.status === 403) {
    var error = new Error("Insufficient privilege, you cannot access this page");
    error.res = res;
    throw error;
  } else if (res.status === 401) {
    var error = new Error("Unauthorized access");
    error.res = res;
    throw error;
  } else {
    var error = new Error(res.statusText);
    error.res = res;
    throw error;
  }
}

function requestJson(uri, dispatch, getState) {
  var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var _ref$verb = _ref.verb;
  var verb = _ref$verb === undefined ? 'get' : _ref$verb;
  var _ref$header = _ref.header;
  var header = _ref$header === undefined ? 'Runtime Error' : _ref$header;
  var body = _ref.body;
  var _ref$message = _ref.message;
  var message = _ref$message === undefined ? 'Check your backend server' : _ref$message;

  var promise = undefined;

  var _getState = getState();

  var _getState$login = _getState.login;
  var appJwt = _getState$login.appJwt;
  var sessionId = _getState$login.sessionId;

  var absoluteUri = window.location ? window.location.origin + uri : uri;

  dispatch((0, _actionsLoading.startLoading)());

  if (!body) promise = fetchJson(absoluteUri, {
    method: verb,
    headers: {
      'X-Token-Access': appJwt,
      'X-SessionId': sessionId
    }
  });else promise = fetchJson(absoluteUri, {
    method: verb,
    //credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Token-Access': appJwt,
      'X-SessionId': sessionId
    },
    body: JSON.stringify(body || {})
  });

  promise.then(function (res) {
    dispatch((0, _actionsLoading.stopLoading)());
    return res;
  })['catch'](function (err) {
    console.error(err.toString());
    dispatch((0, _actionsLoading.stopLoading)());
    switch (err.res.status) {
      case 401:
        dispatch((0, _actionsErrors.alert)({ header: err.message, message: message }));
        dispatch((0, _actionsLogin.logout)());
      case 403:
        dispatch((0, _actionsErrors.alert)({ header: err.message, message: message }));
        dispatch((0, _actionsRoutes.gotoLogin)());
      default:
        dispatch((0, _actionsErrors.alert)({ header: header, message: message }));
    }
  });

  return promise;
}

function fetchJson() {
  return fetch.apply(undefined, arguments).then(checkStatus).then(parseJSON);
}
//# sourceMappingURL=index.js.map
