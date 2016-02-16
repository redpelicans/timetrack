'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.enter = enter;
var ENTER_ROUTE = 'ENTER_ROUTE';

exports.ENTER_ROUTE = ENTER_ROUTE;

function enter(currentRoute) {
  return {
    type: ENTER_ROUTE,
    currentRoute: currentRoute
  };
}

var sitemapActions = { enter: enter };
exports.sitemapActions = sitemapActions;
//# sourceMappingURL=sitemap.js.map
