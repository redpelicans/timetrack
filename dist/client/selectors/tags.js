'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _reselect = require('reselect');

var tags = function tags(state) {
  return state.tags;
};

var tagsSelector = (0, _reselect.createSelector)(tags, function (tags) {
  return {
    tags: tags.map(function (tag) {
      return { key: tag, value: tag };
    }).toJS()
  };
});
exports.tagsSelector = tagsSelector;
//# sourceMappingURL=tags.js.map
