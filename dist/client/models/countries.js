'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _utils = require('../utils');

var actions = _reflux2['default'].createActions(["load"]);

var state = {
  data: _immutable2['default'].List()
};

var store = _reflux2['default'].createStore({

  listenables: [actions],

  onLoad: function onLoad() {
    var _this = this;

    (0, _utils.requestJson)('/api/countries', { message: 'Cannot load countries, check your backend server' }).then(function (countries) {
      state.data = _immutable2['default'].fromJS(countries);
      _this.trigger(state);
    });
  }

});

exports.countriesStore = store;
exports.countriesActions = actions;
//# sourceMappingURL=countries.js.map
