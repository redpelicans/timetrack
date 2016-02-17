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

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _reactFileInput = require('react-file-input');

var _reactFileInput2 = _interopRequireDefault(_reactFileInput);

var _remarkable = require('remarkable');

var _remarkable2 = _interopRequireDefault(_remarkable);

var _reactWidgetsLibCombobox = require('react-widgets/lib/Combobox');

var _reactWidgetsLibCombobox2 = _interopRequireDefault(_reactWidgetsLibCombobox);

var _reactWidgetsLibDropdownList = require('react-widgets/lib/DropdownList');

var _reactWidgetsLibDropdownList2 = _interopRequireDefault(_reactWidgetsLibDropdownList);

var _reactWidgetsLibMultiselect = require('react-widgets/lib/Multiselect');

var _reactWidgetsLibMultiselect2 = _interopRequireDefault(_reactWidgetsLibMultiselect);

var _reactWidgetsLibDateTimePicker = require('react-widgets/lib/DateTimePicker');

var _reactWidgetsLibDateTimePicker2 = _interopRequireDefault(_reactWidgetsLibDateTimePicker);

var _formsCompany = require('../forms/company');

var _widgets = require('./widgets');

var BaseField = (function (_Component) {
  _inherits(BaseField, _Component);

  function BaseField() {
    var _this = this;

    _classCallCheck(this, BaseField);

    _get(Object.getPrototypeOf(BaseField.prototype), 'constructor', this).apply(this, arguments);

    this.state = { field: undefined };

    this.handleChange = function (e) {
      _this.props.field.setValue(e.target.value);
    };

    this.message = function () {
      if (_this.state.field && _this.state.field.get('error')) return _this.state.field.get('error');
      if (_this.state.field && _this.state.field.get('isLoading')) return 'Loading ...';
    };

    this.hasError = function () {
      return _this.state.field && _this.state.field.get('error');
    };

    this.fieldsetClassNames = function () {
      return (0, _classnames2['default'])("form-group", { 'has-error': _this.hasError() });
    };

    this.inputClassNames = function () {
      return (0, _classnames2['default'])('tm input form-control', { 'form-control-error': _this.hasError() });
    };
  }

  _createClass(BaseField, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.field.state.offValue(this.subscribeFct);
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.subscribeFct = function (v) {
        return _this2.setState({ field: v });
      };
      this.props.field.state.onValue(this.subscribeFct);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.state.field != nextState.field;
    }
  }]);

  return BaseField;
})(_react.Component);

exports.BaseField = BaseField;

BaseField.propTypes = {
  field: _react.PropTypes.object.isRequired
};

var InputField = (function (_BaseField) {
  _inherits(InputField, _BaseField);

  function InputField() {
    _classCallCheck(this, InputField);

    _get(Object.getPrototypeOf(InputField.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(InputField, [{
    key: 'render',
    value: function render() {
      if (!this.state.field) return false;
      var field = this.props.field;
      var labelUrl = this.props.isUrl ? _react2['default'].createElement(
        'a',
        { href: this.state.field.get('value') },
        _react2['default'].createElement('i', { className: 'fa fa-external-link p-l-1' })
      ) : "";

      return _react2['default'].createElement(
        'fieldset',
        { className: this.fieldsetClassNames() },
        _react2['default'].createElement(
          'label',
          { htmlFor: field.key },
          field.label,
          labelUrl
        ),
        _react2['default'].createElement('input', { className: this.inputClassNames(), id: field.key, type: field.htmlType(), value: this.state.field.get('value'), placeholder: field.label, onChange: this.handleChange }),
        _react2['default'].createElement(
          'small',
          { className: 'text-muted control-label' },
          this.message()
        )
      );
    }
  }]);

  return InputField;
})(BaseField);

exports.InputField = InputField;

InputField.propTypes = {
  field: _react.PropTypes.object.isRequired,
  isUrl: _react.PropTypes.bool
};

var FileField = (function (_BaseField2) {
  _inherits(FileField, _BaseField2);

  function FileField() {
    var _this3 = this;

    _classCallCheck(this, FileField);

    _get(Object.getPrototypeOf(FileField.prototype), 'constructor', this).apply(this, arguments);

    this.handleChange = function (e) {
      _this3.props.onFilenameChange(e.target.value);
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        _this3.props.field.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    };
  }

  _createClass(FileField, [{
    key: 'render',
    value: function render() {
      if (!this.state.field) return false;

      var field = this.props.field;

      var style = {
        display: 'block',
        height: '36px'
      };

      return _react2['default'].createElement(
        'fieldset',
        { className: this.fieldsetClassNames() },
        _react2['default'].createElement(
          'label',
          { htmlFor: field.key },
          field.label
        ),
        _react2['default'].createElement(_reactFileInput2['default'], {
          className: this.inputClassNames(),
          id: field.key,
          placeholder: this.props.filename || field.label,
          onChange: this.handleChange }),
        _react2['default'].createElement(
          'small',
          { className: 'text-muted control-label' },
          this.message()
        )
      );
    }
  }]);

  return FileField;
})(BaseField);

exports.FileField = FileField;

FileField.propTypes = {
  field: _react.PropTypes.object.isRequired,
  onFilenameChange: _react.PropTypes.func.isRequired,
  filename: _react.PropTypes.string
};

var MarkdownEditField = (function (_BaseField3) {
  _inherits(MarkdownEditField, _BaseField3);

  function MarkdownEditField() {
    var _this4 = this;

    _classCallCheck(this, MarkdownEditField);

    _get(Object.getPrototypeOf(MarkdownEditField.prototype), 'constructor', this).apply(this, arguments);

    this.state = { mode: 'write' };

    this.handleClick = function (mode, e) {
      e.preventDefault();
      _this4.setState({ mode: mode });
    };
  }

  _createClass(MarkdownEditField, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.state.field != nextState.field || this.state.mode != nextState.mode;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      if (!this.state.field) return false;
      var field = this.props.field;

      var styles = {
        reader: {
          height: '100%',
          minHeight: '150px'
        },
        writer: {
          height: '100%',
          minHeight: '150px'
        },
        radio: {
          paddingTop: '5px',
          float: 'right'
        },
        button: {
          fontSize: '.7rem',
          lineHeight: '.5rem'
        }
      };

      var reader = function reader() {
        var classes = (0, _classnames2['default'])(' form-control', {
          'form-control-focus': _this5.props.focused
        });
        var md = new _remarkable2['default']();
        var text = { __html: md.render(_this5.state.field.get('value')) };

        return _react2['default'].createElement('div', { style: styles.reader, className: classes, id: field.label, dangerouslySetInnerHTML: text });
      };

      var writer = function writer() {
        var classes = (0, _classnames2['default'])('tm input form-control', {
          'form-control-error': _this5.hasError(),
          'form-control-focus': _this5.props.focused
        });

        return _react2['default'].createElement('textarea', {
          style: styles.writer,
          className: classes,
          id: field.key,
          type: field.htmlType(),
          value: _this5.state.field.get('value'),
          placeholder: field.label,
          onChange: _this5.handleChange });
      };

      var widget = this.state.mode === 'write' ? writer() : reader();

      return _react2['default'].createElement(
        'fieldset',
        { className: this.fieldsetClassNames() },
        _react2['default'].createElement(
          'label',
          { htmlFor: field.key },
          field.label
        ),
        widget,
        _react2['default'].createElement(
          'div',
          { style: styles.radio, className: 'btn-group', 'data-toggle': 'buttons' },
          _react2['default'].createElement(
            'label',
            { style: styles.button, className: 'btn btn-secondary active', onClick: this.handleClick.bind(null, 'write') },
            _react2['default'].createElement('input', { type: 'radio', name: 'options', id: 'option1', autoComplete: 'off' }),
            ' Edit'
          ),
          _react2['default'].createElement(
            'label',
            { style: styles.button, className: 'btn btn-secondary', onClick: this.handleClick.bind(null, 'read') },
            _react2['default'].createElement('input', { type: 'radio', name: 'options', id: 'option2', autoComplete: 'off' }),
            ' View'
          )
        ),
        _react2['default'].createElement(
          'small',
          { className: 'text-muted control-label' },
          this.message()
        )
      );
    }
  }]);

  return MarkdownEditField;
})(BaseField);

exports.MarkdownEditField = MarkdownEditField;

MarkdownEditField.propTypes = {
  field: _react.PropTypes.object.isRequired,
  focused: _react.PropTypes.bool
};

var TextAreaField = (function (_BaseField4) {
  _inherits(TextAreaField, _BaseField4);

  function TextAreaField() {
    _classCallCheck(this, TextAreaField);

    _get(Object.getPrototypeOf(TextAreaField.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TextAreaField, [{
    key: 'render',
    value: function render() {
      // avoid to render without a state
      if (!this.state.field) return false;

      var field = this.props.field;
      var labelUrl = this.props.isUrl ? _react2['default'].createElement(
        'a',
        { href: this.state.field.get('value') },
        _react2['default'].createElement('i', { className: 'fa fa-external-link p-l-1' })
      ) : "";

      var styles = {
        textarea: {
          minHeight: '200px'
        }
      };

      return _react2['default'].createElement(
        'fieldset',
        { className: this.fieldsetClassNames() },
        _react2['default'].createElement(
          'label',
          { htmlFor: field.key },
          field.label,
          labelUrl
        ),
        _react2['default'].createElement('textarea', { style: styles.textarea, className: inputClassNames, id: field.key, type: field.htmlType(), value: this.state.field.get('value'), placeholder: field.label, onChange: this.handleChange }),
        _react2['default'].createElement(
          'small',
          { className: 'text-muted control-label' },
          this.message()
        )
      );
    }
  }]);

  return TextAreaField;
})(BaseField);

exports.TextAreaField = TextAreaField;

TextAreaField.propTypes = {
  field: _react.PropTypes.object.isRequired,
  isUrl: _react.PropTypes.bool
};

var BaseSelectField = (function (_BaseField5) {
  _inherits(BaseSelectField, _BaseField5);

  function BaseSelectField() {
    var _this6 = this;

    _classCallCheck(this, BaseSelectField);

    _get(Object.getPrototypeOf(BaseSelectField.prototype), 'constructor', this).apply(this, arguments);

    this.handleChange = function (value) {
      _this6.props.field.setValue(value);
    };

    this.selectClassNames = function () {
      return (0, _classnames2['default'])('tm select form-control', { 'form-control-error': _this6.hasError() });
    };
  }

  _createClass(BaseSelectField, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      //return this.state.field != nextState.field;
      return true;
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this7 = this;

      this.subscribeFct = function (v) {
        var state = { field: v };
        if (v.get('domainValue')) {
          var domainValue = _.map(v.get('domainValue').toJS(), function (_ref) {
            var key = _ref.key;
            var value = _ref.value;
            return { label: value, value: key };
          });
          state.domainValue = domainValue;
        }
        _this7.setState(state);
      };
      this.props.field.state.onValue(this.subscribeFct);
    }
  }]);

  return BaseSelectField;
})(BaseField);

exports.BaseSelectField = BaseSelectField;

BaseSelectField.propTypes = {
  field: _react.PropTypes.object.isRequired
};

var DropdownField = (function (_BaseSelectField) {
  _inherits(DropdownField, _BaseSelectField);

  function DropdownField() {
    var _this8 = this;

    _classCallCheck(this, DropdownField);

    _get(Object.getPrototypeOf(DropdownField.prototype), 'constructor', this).apply(this, arguments);

    this.handleChange = function (value) {
      _this8.props.field.setValue(value.key);
    };
  }

  _createClass(DropdownField, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this9 = this;

      this.subscribeFct = function (v) {
        var state = { field: v };
        if (v.get('domainValue')) state.domainValue = v.get('domainValue').toJS();
        _this9.setState(state);
      };
      this.props.field.state.onValue(this.subscribeFct);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this10 = this;

      if (!this.state.field) return false;
      var field = this.props.field;

      if (this.state.field.get('disabled')) {
        var keyValue = _.find(this.state.domainValue, function (x) {
          return x.key === _this10.state.field.get("value");
        });
        return _react2['default'].createElement(_widgets.TextLabel, { label: field.label, value: keyValue && keyValue.value });
      } else {
        return _react2['default'].createElement(
          'fieldset',
          { className: this.fieldsetClassNames() },
          _react2['default'].createElement(
            'label',
            { htmlFor: field.key },
            field.label
          ),
          _react2['default'].createElement(_reactWidgetsLibDropdownList2['default'], {
            placeholder: field.label,
            valueField: 'key',
            textField: 'value',
            data: this.state.domainValue,
            defaultValue: this.state.field.get('value'),
            id: field.key,
            caseSensitive: false,
            onChange: this.handleChange }),
          _react2['default'].createElement(
            'small',
            { className: 'text-muted control-label' },
            this.message()
          )
        );
      }
    }
  }]);

  return DropdownField;
})(BaseSelectField);

exports.DropdownField = DropdownField;

DropdownField.propTypes = {
  field: _react.PropTypes.object.isRequired
};

var MultiSelectField2 = (function (_BaseSelectField2) {
  _inherits(MultiSelectField2, _BaseSelectField2);

  function MultiSelectField2() {
    var _this11 = this;

    _classCallCheck(this, MultiSelectField2);

    _get(Object.getPrototypeOf(MultiSelectField2.prototype), 'constructor', this).apply(this, arguments);

    this.handleChange = function (values) {
      _this11.props.field.setValue(_.map(values, function (v) {
        return v.key;
      }));
    };
  }

  _createClass(MultiSelectField2, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this12 = this;

      this.subscribeFct = function (v) {
        var state = { field: v };
        if (v.get('domainValue')) state.domainValue = v.get('domainValue').toJS();
        _this12.setState(state);
      };
      this.props.field.state.onValue(this.subscribeFct);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this13 = this;

      if (!this.state.field) return false;
      var field = this.props.field;

      if (this.state.field.get('disabled')) {
        var keyValue = _.find(this.state.domainValue, function (x) {
          return x.value === _this13.state.field.get("value");
        });
        return _react2['default'].createElement(_widgets.TextLabel, { label: field.label, value: keyValue && keyValue.label });
      } else {
        var props = {
          placeholder: field.label,
          valueField: 'key',
          textField: 'value',
          data: this.state.domainValue,
          value: this.state.field.get('value') && this.state.field.get('value').toJS() || [],
          id: field.key,
          caseSensitive: false,
          onChange: this.handleChange
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

  return MultiSelectField2;
})(BaseSelectField);

exports.MultiSelectField2 = MultiSelectField2;

MultiSelectField2.propTypes = {
  field: _react.PropTypes.object.isRequired
};

var ComboboxField = (function (_BaseSelectField3) {
  _inherits(ComboboxField, _BaseSelectField3);

  function ComboboxField() {
    var _this14 = this;

    _classCallCheck(this, ComboboxField);

    _get(Object.getPrototypeOf(ComboboxField.prototype), 'constructor', this).apply(this, arguments);

    this.handleChange = function (value) {
      var data = _.isString(value) ? value : value.key;
      _this14.props.field.setValue(data);
    };
  }

  _createClass(ComboboxField, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this15 = this;

      this.subscribeFct = function (v) {
        var state = { field: v };
        if (v.get('domainValue')) state.domainValue = v.get('domainValue').toJS();
        _this15.setState(state);
      };

      this.props.field.state.onValue(this.subscribeFct);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this16 = this;

      if (!this.state.field) return false;
      var field = this.props.field;
      if (this.state.field.get('disabled')) {
        var keyValue = _.find(this.state.domainValue, function (x) {
          return x.value === _this16.state.field.get("value");
        });
        return _react2['default'].createElement(_widgets.TextLabel, { label: field.label, value: keyValue && keyValue.label });
      } else {
        return _react2['default'].createElement(
          'fieldset',
          { className: this.fieldsetClassNames() },
          _react2['default'].createElement(
            'label',
            { htmlFor: field.key },
            field.label
          ),
          _react2['default'].createElement(_reactWidgetsLibCombobox2['default'], {
            placeholder: field.label,
            valueField: 'key',
            textField: 'value',
            suggest: true,
            data: this.state.domainValue,
            defaultValue: this.state.field.get('value'),
            id: field.key,
            caseSensitive: false,
            onChange: this.handleChange }),
          _react2['default'].createElement(
            'small',
            { className: 'text-muted control-label' },
            this.message()
          )
        );
      }
    }
  }]);

  return ComboboxField;
})(BaseSelectField);

exports.ComboboxField = ComboboxField;

ComboboxField.propTypes = {
  field: _react.PropTypes.object.isRequired
};

var SelectField = (function (_BaseSelectField4) {
  _inherits(SelectField, _BaseSelectField4);

  function SelectField() {
    _classCallCheck(this, SelectField);

    _get(Object.getPrototypeOf(SelectField.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SelectField, [{
    key: 'render',
    value: function render() {
      var _this17 = this;

      if (!this.state.field) return false;
      var field = this.props.field;

      if (this.state.field.get('disabled')) {
        var keyValue = _.find(this.state.domainValue, function (x) {
          return x.value === _this17.state.field.get("value");
        });
        return _react2['default'].createElement(_widgets.TextLabel, { label: field.label, value: keyValue && keyValue.label });
      } else {
        return _react2['default'].createElement(
          'fieldset',
          { className: this.fieldsetClassNames() },
          _react2['default'].createElement(
            'label',
            { htmlFor: field.key },
            field.label
          ),
          _react2['default'].createElement(_reactSelect2['default'], {
            options: this.state.domainValue,
            value: this.state.field.get('value'),
            id: field.key,
            clearable: false,
            onChange: this.handleChange }),
          _react2['default'].createElement(
            'small',
            { className: 'text-muted control-label' },
            this.message()
          )
        );
      }
    }
  }]);

  return SelectField;
})(BaseSelectField);

exports.SelectField = SelectField;

SelectField.propTypes = {
  field: _react.PropTypes.object.isRequired
};

var ColorItem = function ColorItem(_ref2) {
  var item = _ref2.item;

  var style = {
    backgroundColor: item.value,
    width: '100%',
    height: '2rem'
  };
  return _react2['default'].createElement('div', { style: style });
};

ColorItem.propTypes = {
  item: _react.PropTypes.object.isRequired
};

var SelectColorField = (function (_BaseSelectField5) {
  _inherits(SelectColorField, _BaseSelectField5);

  function SelectColorField() {
    var _this18 = this;

    _classCallCheck(this, SelectColorField);

    _get(Object.getPrototypeOf(SelectColorField.prototype), 'constructor', this).apply(this, arguments);

    this.handleChange = function (value) {
      _this18.props.field.setValue(value.key);
    };
  }

  _createClass(SelectColorField, [{
    key: 'render',
    value: function render() {
      if (!this.state.field) return false;
      var field = this.props.field;

      var options = _.map(this.props.options, function (color) {
        return { key: color, value: color };
      });

      return _react2['default'].createElement(
        'fieldset',
        { className: this.fieldsetClassNames() },
        _react2['default'].createElement(
          'label',
          { htmlFor: field.key },
          field.label
        ),
        _react2['default'].createElement(_reactWidgetsLibDropdownList2['default'], {
          valueField: 'key',
          textField: 'value',
          data: options,
          valueComponent: ColorItem,
          itemComponent: ColorItem,
          value: this.state.field.get('value'),
          id: field.key,
          onChange: this.handleChange }),
        _react2['default'].createElement(
          'small',
          { className: 'text-muted control-label' },
          this.message()
        )
      );
    }
  }]);

  return SelectColorField;
})(BaseSelectField);

exports.SelectColorField = SelectColorField;

SelectColorField.propTypes = {
  field: _react.PropTypes.object.isRequired,
  options: _react.PropTypes.arrayOf(_react.PropTypes.string).isRequired
};

var MultiSelectField = (function (_BaseSelectField6) {
  _inherits(MultiSelectField, _BaseSelectField6);

  function MultiSelectField() {
    var _this19 = this;

    _classCallCheck(this, MultiSelectField);

    _get(Object.getPrototypeOf(MultiSelectField.prototype), 'constructor', this).apply(this, arguments);

    this.handleChange = function (value) {
      _this19.props.field.setValue(value && value.split(',') || []);
    };
  }

  _createClass(MultiSelectField, [{
    key: 'render',
    value: function render() {
      var _this20 = this;

      if (!this.state.field) return false;
      var field = this.props.field;

      if (this.state.field.get('disabled')) {
        var keyValue = _.find(this.state.domainValue, function (x) {
          return x.key === _this20.state.field.get('value');
        });
        return _react2['default'].createElement(_widgets.TextLabel, { label: field.label, value: keyValue && keyValue.value });
      } else {
        var value = this.state.field.get('value');
        return _react2['default'].createElement(
          'fieldset',
          { className: this.fieldsetClassNames() },
          _react2['default'].createElement(
            'label',
            { htmlFor: field.key },
            field.label
          ),
          _react2['default'].createElement(_reactSelect2['default'], {
            options: this.state.domainValue,
            value: value && value.toJS(),
            id: field.key,
            clearable: false,
            allowCreate: this.props.allowCreate,
            multi: true,
            onChange: this.handleChange }),
          _react2['default'].createElement(
            'small',
            { className: 'text-muted control-label' },
            this.message()
          )
        );
      }
    }
  }]);

  return MultiSelectField;
})(BaseSelectField);

exports.MultiSelectField = MultiSelectField;

MultiSelectField.propTypes = {
  field: _react.PropTypes.object.isRequired,
  allowCreate: _react.PropTypes.bool
};

var AvatarViewField = (function (_Component2) {
  _inherits(AvatarViewField, _Component2);

  function AvatarViewField() {
    _classCallCheck(this, AvatarViewField);

    _get(Object.getPrototypeOf(AvatarViewField.prototype), 'constructor', this).apply(this, arguments);

    this.state = { name: 'Red Pelicans' };
  }

  _createClass(AvatarViewField, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribe();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this21 = this;

      this.unsubscribe = this.props.obj.onValue(function (state) {
        var name = undefined;
        if (_this21.props.type === 'company') name = state.name.value;else name = [state.firstName.value, state.lastName.value].join(' ');
        _this21.setState({
          type: state.avatar.type.value,
          name: name,
          color: state.avatar.color.value,
          url: state.avatar.url.error ? undefined : state.avatar.url.value,
          src: state.avatar.src.value
        });
      });
    }
  }, {
    key: 'getAvatarType',
    value: function getAvatarType() {
      var defaultAvatar = _react2['default'].createElement(
        'div',
        { className: 'm-r-1' },
        _react2['default'].createElement(_widgets.Avatar, { name: this.state.name, color: this.state.color })
      );
      switch (this.state.type) {
        case 'url':
          return this.state.url ? _react2['default'].createElement(
            'div',
            { className: 'm-r-1' },
            ' ',
            _react2['default'].createElement(_widgets.Avatar, { src: this.state.url })
          ) : defaultAvatar;
        case 'src':
          return this.state.src ? _react2['default'].createElement(
            'div',
            { className: 'm-r-1' },
            _react2['default'].createElement(_widgets.Avatar, { src: this.state.src })
          ) : defaultAvatar;
        default:
          return defaultAvatar;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.getAvatarType();
    }
  }]);

  return AvatarViewField;
})(_react.Component);

exports.AvatarViewField = AvatarViewField;

AvatarViewField.propTypes = {
  obj: _react.PropTypes.object.isRequired,
  type: _react.PropTypes.string
};

var AvatarChooserField = (function (_Component3) {
  _inherits(AvatarChooserField, _Component3);

  function AvatarChooserField() {
    var _this22 = this;

    _classCallCheck(this, AvatarChooserField);

    _get(Object.getPrototypeOf(AvatarChooserField.prototype), 'constructor', this).apply(this, arguments);

    this.state = { type: this.props.field.defaultValue };

    this.handleFilenameChange = function (filename) {
      _this22.setState({ filename: filename });
    };
  }

  _createClass(AvatarChooserField, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribe();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this23 = this;

      this.colorField = _react2['default'].createElement(SelectColorField, { options: _formsCompany.colors, field: this.props.field.field('color') });
      this.logoUrlField = _react2['default'].createElement(InputField, { field: this.props.field.field('url'), isUrl: true });
      this.logoFileField = _react2['default'].createElement(FileField, { filename: this.state.filename, onFilenameChange: this.handleFilenameChange, field: this.props.field.field('src') });

      this.unsubscribe = this.props.field.onValue(function (v) {
        _this23.setState({
          type: v.type.value
        });
      });
    }
  }, {
    key: 'getField',
    value: function getField() {
      switch (this.state.type) {
        case 'url':
          return this.logoUrlField;
        case 'src':
          return this.logoFileField;
        default:
          return this.colorField;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: 'row' },
        _react2['default'].createElement(
          'div',
          { className: 'col-md-3' },
          _react2['default'].createElement(DropdownField, { field: this.props.field.field('type') })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'col-md-9' },
          this.getField()
        )
      );
    }
  }]);

  return AvatarChooserField;
})(_react.Component);

exports.AvatarChooserField = AvatarChooserField;

AvatarChooserField.propTypes = {
  field: _react.PropTypes.object.isRequired
};

var StarField = (function (_Component4) {
  _inherits(StarField, _Component4);

  function StarField() {
    var _this24 = this;

    _classCallCheck(this, StarField);

    _get(Object.getPrototypeOf(StarField.prototype), 'constructor', this).apply(this, arguments);

    this.state = undefined;

    this.handleChange = function (e) {
      _this24.props.field.setValue(!_this24.state.preferred);
      e.preventDefault();
    };
  }

  _createClass(StarField, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribe) this.unsubscribe();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this25 = this;

      this.unsubscribe = this.props.field.onValue(function (v) {
        _this25.setState({ preferred: v.value });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state) return false;
      var field = this.props.field;
      var preferred = this.state.preferred;

      var style = {
        display: 'block',
        color: preferred ? '#00BCD4' : 'grey',
        fontSize: '1.5rem'
      };

      return _react2['default'].createElement(
        'fieldset',
        { className: 'form-group' },
        _react2['default'].createElement(
          'label',
          { htmlFor: field.key },
          field.label
        ),
        _react2['default'].createElement(
          'a',
          { id: field.key, href: '#', onClick: this.handleChange },
          _react2['default'].createElement('i', { style: style, className: 'iconButton fa fa-star-o' })
        )
      );
    }
  }]);

  return StarField;
})(_react.Component);

exports.StarField = StarField;

StarField.propTypes = {
  field: _react.PropTypes.object.isRequired
};

var DateField = (function (_BaseField6) {
  _inherits(DateField, _BaseField6);

  function DateField() {
    var _this26 = this;

    _classCallCheck(this, DateField);

    _get(Object.getPrototypeOf(DateField.prototype), 'constructor', this).apply(this, arguments);

    this.handleChange = function (date) {
      _this26.props.field.setValue(date);
    };
  }

  _createClass(DateField, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.state.field != nextState.field || this.props.maxDate != nextProps.maxDate || this.props.minDate != nextProps.minDate;
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.field) return false;
      var field = this.props.field;
      var labelUrl = this.props.isUrl ? _react2['default'].createElement(
        'a',
        { href: this.state.field.get('value') },
        _react2['default'].createElement('i', { className: 'fa fa-external-link p-l-1' })
      ) : "";
      var props = {
        value: this.state.field.get('value'),
        onChange: this.handleChange,
        time: false
      };
      if (this.props.minDate) props.min = this.props.minDate;
      if (this.props.maxDate) props.max = this.props.maxDate;
      var Picker = _react2['default'].createElement(_reactWidgetsLibDateTimePicker2['default'], props);

      return _react2['default'].createElement(
        'fieldset',
        { className: this.fieldsetClassNames() },
        _react2['default'].createElement(
          'label',
          { htmlFor: field.key },
          field.label,
          labelUrl
        ),
        Picker,
        _react2['default'].createElement(
          'small',
          { className: 'text-muted control-label' },
          this.message()
        )
      );
    }
  }]);

  return DateField;
})(BaseField);

exports.DateField = DateField;

DateField.propTypes = {
  field: _react.PropTypes.object.isRequired,
  minDate: _react.PropTypes.object,
  maxDate: _react.PropTypes.object,
  isUrl: _react.PropTypes.bool
};

var PeriodField = (function (_Component5) {
  _inherits(PeriodField, _Component5);

  function PeriodField() {
    _classCallCheck(this, PeriodField);

    _get(Object.getPrototypeOf(PeriodField.prototype), 'constructor', this).apply(this, arguments);

    this.state = {};
  }

  _createClass(PeriodField, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribe1();
      this.unsubscribe2();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this27 = this;

      this.unsubscribe1 = this.props.startDate.onValue(function (state) {
        _this27.setState({ startDate: state.value });
      });
      this.unsubscribe2 = this.props.endDate.onValue(function (state) {
        _this27.setState({ endDate: state.value });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { className: 'row' },
        _react2['default'].createElement(
          'div',
          { className: 'col-md-6' },
          _react2['default'].createElement(DateField, { field: this.props.startDate, maxDate: this.state.endDate })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'col-md-6' },
          _react2['default'].createElement(DateField, { field: this.props.endDate, minDate: this.state.startDate })
        )
      );
    }
  }]);

  return PeriodField;
})(_react.Component);

exports.PeriodField = PeriodField;

PeriodField.propTypes = {
  startDate: _react.PropTypes.object,
  endDate: _react.PropTypes.object
};
//# sourceMappingURL=fields.js.map
