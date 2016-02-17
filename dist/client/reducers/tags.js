'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = tagsReducer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actionsTags = require('../actions/tags');

var initialState = _immutable2['default'].List();

function tagsReducer(state, action) {
  if (state === undefined) state = initialState;

  switch (action.type) {
    case _actionsTags.TAGS_LOADED:
      return action.tags;
    default:
      return state;
  }
}

module.exports = exports['default'];
//# sourceMappingURL=tags.js.map
