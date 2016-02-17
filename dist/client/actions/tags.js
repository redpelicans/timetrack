'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.loadTags = loadTags;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utils = require('../utils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var TAGS_LOADED = 'TAGS_LOADED';

exports.TAGS_LOADED = TAGS_LOADED;
function tagsLoaded(tags) {
  return {
    type: TAGS_LOADED,
    tags: _immutable2['default'].fromJS(tags)
  };
}

function loadTags() {
  return function (dispatch, getState) {
    (0, _utils.requestJson)('/api/tags', dispatch, getState, { message: 'Cannot load tags, check your backend server' }).then(function (tags) {
      return dispatch(tagsLoaded(tags));
    });
  };
}

var tagsActions = {
  load: loadTags
};
exports.tagsActions = tagsActions;
//# sourceMappingURL=tags.js.map
