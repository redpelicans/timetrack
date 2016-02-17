'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _fields = require('./fields');

var PhonesField = (function (_Component) {
  _inherits(PhonesField, _Component);

  function PhonesField() {
    var _this = this;

    _classCallCheck(this, PhonesField);

    _get(Object.getPrototypeOf(PhonesField.prototype), 'constructor', this).apply(this, arguments);

    this.fieldsetClassNames = function () {
      return (0, _classnames2['default'])("form-group");
    };

    this.handleAdd = function (e) {
      e.preventDefault();
      _this.props.field.addField();
    };

    this.handleDelete = function (field, e) {
      e.preventDefault();
      _this.props.field.deleteField(field);
    };
  }

  _createClass(PhonesField, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.field.state.offValue(this.subscribeFct);
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.subscribeFct = function (v) {
        _this2.setState({ field: v });
      };
      if (!this.props.field.length) this.props.field.addField();
      this.props.field.state.onValue(this.subscribeFct);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.state.field != nextState.field;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var styles = {
        add: {
          fontSize: '1rem'
        }
      };
      var field = this.props.field;
      var phones = _.map(field.getFields(), function (field) {
        return _react2['default'].createElement(
          'div',
          { key: field.path, className: 'col-md-4' },
          _react2['default'].createElement(Phone, { field: field, onDeleteField: _this3.handleDelete })
        );
      });
      return _react2['default'].createElement(
        'fieldset',
        { className: this.fieldsetClassNames() },
        _react2['default'].createElement(
          'label',
          { htmlFor: field.key },
          _react2['default'].createElement(
            'span',
            null,
            'Phones'
          ),
          _react2['default'].createElement(
            'a',
            { href: '#', onClick: this.handleAdd },
            _react2['default'].createElement('i', { style: styles.add, className: 'iconButton fa fa-plus m-a-1' })
          )
        ),
        _react2['default'].createElement(
          'div',
          { className: 'row' },
          phones
        )
      );
    }
  }]);

  return PhonesField;
})(_react.Component);

exports.PhonesField = PhonesField;

var Phone = (function (_Component2) {
  _inherits(Phone, _Component2);

  function Phone() {
    _classCallCheck(this, Phone);

    _get(Object.getPrototypeOf(Phone.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Phone, [{
    key: 'render',
    value: function render() {
      var styles = {
        container: {
          display: 'flex',
          flexWrap: 'nowrap'

        },
        number: {
          flexBasis: 'auto'
        },
        number: {
          flexGrow: 1
        },
        'delete': {
          paddingTop: '35px',
          paddingLeft: '10px',
          fontSize: '1rem'
        }
      };

      return _react2['default'].createElement(
        'div',
        { style: styles.container, className: 'row' },
        _react2['default'].createElement(
          'div',
          { style: styles.label, className: 'col-md-4' },
          _react2['default'].createElement(_fields.DropdownField, { field: this.props.field.field('label') })
        ),
        _react2['default'].createElement(
          'div',
          { style: styles.number, className: 'm-l-1' },
          _react2['default'].createElement(_fields.InputField, { field: this.props.field.field('number') })
        ),
        _react2['default'].createElement(
          'div',
          { style: styles['delete'] },
          _react2['default'].createElement(
            'a',
            { className: '', href: '#', onClick: this.props.onDeleteField.bind(null, this.props.field) },
            _react2['default'].createElement('i', { className: 'iconButton danger fa fa-minus-circle m-r-1' })
          )
        )
      );
    }
  }]);

  return Phone;
})(_react.Component);

exports.Phone = Phone;
//# sourceMappingURL=phone.js.map
