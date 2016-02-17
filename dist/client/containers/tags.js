'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _selectorsTags = require('../selectors/tags');

var _actionsTags = require('../actions/tags');

var _reactWidgetsLibMultiselect = require('react-widgets/lib/Multiselect');

var _reactWidgetsLibMultiselect2 = _interopRequireDefault(_reactWidgetsLibMultiselect);

var _componentsFields = require('../components/fields');

var TagItem = function TagItem(_ref) {
  var item = _ref.item;

  var styles = {
    label: {
      backgroundColor: '#0275d8',
      marginRight: '1rem'
    }
  };

  var handleClick = function handleClick(e) {
    e.preventDefault();
    onClick(item.value);
  };

  // if(onClick){
  //   return (
  //     <a href="#" onClick={handleClick}>
  //       <span style={styles.label}>{item.value}</span>
  //     </a>
  //   )
  // }else{
  //   return <span style={styles.label}>{item.value}</span>;
  // }

  return _react2['default'].createElement(
    'span',
    { style: styles.label },
    item.value
  );
};

var TagField = (function (_BaseSelectField) {
  _inherits(TagField, _BaseSelectField);

  function TagField() {
    var _this = this;

    _classCallCheck(this, TagField);

    _get(Object.getPrototypeOf(TagField.prototype), 'constructor', this).apply(this, arguments);

    this.state = {};

    this.handleChange = function (values) {
      _this.props.field.setValue(_lodash2['default'].map(values, function (v) {
        return v.key;
      }));
    };

    this.onCreate = function (name) {
      var tag = { key: name, value: name };
      var domainValue = _this.state.domainValue;
      domainValue.push(tag);
      var value = _this.state.field.get('value') && _this.state.field.get('value').toJS() || [];
      _this.props.field.setValue(value.concat(name));
      _this.setState({ domainValue: domainValue });
    };
  }

  _createClass(TagField, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.setState({ domainValue: this.props.tags });
      this.subscribeFct = function (v) {
        return _this2.setState({ field: v });
      };
      this.props.field.state.onValue(this.subscribeFct);
      this.props.dispatch(_actionsTags.tagsActions.load());
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ domainValue: nextProps.tags });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (!this.state.field) return false;
      var field = this.props.field;

      if (this.state.field.get('disabled')) {
        var keyValue = _lodash2['default'].find(this.state.domainValue, function (x) {
          return x.value === _this3.state.field.get("value");
        });
        return _react2['default'].createElement(TextLabel, { label: field.label, value: keyValue && keyValue.label });
      } else {
        var props = {
          placeholder: field.label,
          valueField: 'key',
          textField: 'value',
          data: this.state.domainValue,
          value: this.state.field.get('value') && this.state.field.get('value').toJS() || [],
          id: field.key,
          tagComponent: TagItem,
          caseSensitive: false,
          onChange: this.handleChange,
          onCreate: this.onCreate
        };
        var multiselect = _react2['default'].createElement(_reactWidgetsLibMultiselect2['default'], props);

        return _react2['default'].createElement(
          'fieldset',
          { className: this.fieldsetClassNames() },
          _react2['default'].createElement(
            'label',
            { htmlFor: field.key },
            field.label
          ),
          multiselect,
          _react2['default'].createElement(
            'small',
            { className: 'text-muted control-label' },
            this.message()
          )
        );
      }
    }
  }]);

  return TagField;
})(_componentsFields.BaseSelectField);

TagField.propTypes = {
  tags: _react.PropTypes.array,
  field: _react.PropTypes.object.isRequired,
  dispatch: _react.PropTypes.func.isRequired
};

exports['default'] = (0, _reactRedux.connect)(_selectorsTags.tagsSelector)(TagField);
module.exports = exports['default'];
//# sourceMappingURL=tags.js.map
