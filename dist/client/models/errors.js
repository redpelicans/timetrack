"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var actions = _reflux2["default"].createActions(["alert"]);

var store = _reflux2["default"].createStore({

  listenables: [actions],

  onAlert: function onAlert(error) {
    this.trigger(error);
  }
});

exports.errorsStore = store;
exports.errorsActions = actions;
//# sourceMappingURL=errors.js.map
