'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _actionsSitemap = require('../actions/sitemap');

function sitemapReducer(state, action) {
  if (state === undefined) state = {};

  switch (action.type) {
    case _actionsSitemap.ENTER_ROUTE:
      return { currentRoute: action.currentRoute };
    default:
      return state;
  }
}

exports['default'] = sitemapReducer;
module.exports = exports['default'];
//# sourceMappingURL=sitemap.js.map
