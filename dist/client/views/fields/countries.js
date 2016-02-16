'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fields = require('../fields');

var _modelsCountries = require('../../models/countries');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Country = (function (_ComboboxField) {
  _inherits(Country, _ComboboxField);

  function Country() {
    _classCallCheck(this, Country);

    _get(Object.getPrototypeOf(Country.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Country, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _get(Object.getPrototypeOf(Country.prototype), 'componentWillUnmount', this).call(this);
      this.unsubscribeCountries();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this = this;

      this.subscribeFct = function (v) {
        return _this.setState({ field: v });
      };
      this.props.field.state.onValue(this.subscribeFct);

      this.unsubscribeCountries = _modelsCountries.countriesStore.listen(function (countries) {
        _this.setState({ domainValue: _lodash2['default'].map(countries.data.toJS(), function (country) {
            return { key: country, value: country };
          }) });
      });
      _modelsCountries.countriesActions.load();
    }
  }]);

  return Country;
})(_fields.ComboboxField);

exports['default'] = Country;
module.exports = exports['default'];
//# sourceMappingURL=countries.js.map
