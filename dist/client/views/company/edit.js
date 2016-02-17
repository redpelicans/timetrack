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

var _reactMixin = require('react-mixin');

var _reactMixin2 = _interopRequireDefault(_reactMixin);

var _reactRouter = require('react-router');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _layout = require('../layout');

var _formsCompany = require('../../forms/company');

var _formsCompany2 = _interopRequireDefault(_formsCompany);

var _modelsCompanies = require('../../models/companies');

var _modelsNav = require('../../models/nav');

var _widgets = require('../widgets');

var _fields = require('../fields');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var NewCompanyApp = (function (_Component) {
  _inherits(NewCompanyApp, _Component);

  function NewCompanyApp() {
    var _this = this;

    _classCallCheck(this, _NewCompanyApp);

    _get(Object.getPrototypeOf(_NewCompanyApp.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      forceLeave: false
    };

    this.routerWillLeave = function (nextLocation) {
      if (!_this.state.forceLeave && _this.state.hasBeenModified) return "Are you sure you want to leave the page without saving new company?";
      return true;
    };

    this.handleSubmit = function () {
      _this.companyForm.submit();
    };

    this.handleCancel = function () {
      _this.goBack(false);
    };

    this.goBack = function (forceLeave) {
      _this.setState({ forceLeave: forceLeave }, function () {
        _modelsNav.navActions.goBack();
      });
    };
  }

  _createClass(NewCompanyApp, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeSubmit) this.unsubscribeSubmit();
      if (this.unsubscribeState) this.unsubscribeState();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.companyForm = (0, _formsCompany2['default'])();

      this.unsubscribeSubmit = this.companyForm.onSubmit(function (state, document) {
        _modelsCompanies.companiesActions.create(document);
        _this2.goBack(true);
      });

      this.unsubscribeState = this.companyForm.onValue(function (state) {
        _this2.setState({
          canSubmit: state.canSubmit,
          hasBeenModified: state.hasBeenModified
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var submitBtn = _react2['default'].createElement(_widgets.AddBtn, { onSubmit: this.handleSubmit, canSubmit: this.state.canSubmit });
      var cancelBtn = _react2['default'].createElement(_widgets.CancelBtn, { onCancel: this.handleCancel });

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(EditContent, {
          title: "Add a Company",
          submitBtn: submitBtn,
          cancelBtn: cancelBtn,
          goBack: this.goBack,
          companyForm: this.companyForm })
      );
    }
  }], [{
    key: 'contextTypes',
    value: {
      history: _react2['default'].PropTypes.object.isRequired
    },
    enumerable: true
  }]);

  var _NewCompanyApp = NewCompanyApp;
  NewCompanyApp = _reactMixin2['default'].decorate(_reactRouter.Lifecycle)(NewCompanyApp) || NewCompanyApp;
  return NewCompanyApp;
})(_react.Component);

exports.NewCompanyApp = NewCompanyApp;

var EditCompanyApp = (function (_Component2) {
  _inherits(EditCompanyApp, _Component2);

  function EditCompanyApp() {
    var _this3 = this;

    _classCallCheck(this, _EditCompanyApp);

    _get(Object.getPrototypeOf(_EditCompanyApp.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      forceLeave: false
    };

    this.routerWillLeave = function (nextLocation) {
      if (!_this3.state.forceLeave && _this3.state.hasBeenModified) return "Are you sure you want to leave the page without saving updates?";
      return true;
    };

    this.handleSubmit = function () {
      _this3.companyForm.submit();
    };

    this.handleCancel = function () {
      _this3.goBack(false);
    };

    this.goBack = function (forceLeave) {
      _this3.setState({ forceLeave: forceLeave }, function () {
        _modelsNav.navActions.goBack();
      });
    };
  }

  _createClass(EditCompanyApp, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeSubmit) this.unsubscribeSubmit();
      if (this.unsubscribeState) this.unsubscribeState();
      if (this.unsubscribeCompanies) this.unsubscribeCompanies();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this4 = this;

      var companyId = this.props.location.state && this.props.location.state.companyId;

      this.unsubscribeCompanies = _modelsCompanies.companiesStore.listen(function (companies) {
        var company = companies.data.get(companyId);
        if (!company) return _modelsNav.navActions.replace(_routes2['default'].company.list);
        if (!_this4.companyDocument) {
          _this4.companyDocument = company.toJS();
          _this4.companyForm = (0, _formsCompany2['default'])(_this4.companyDocument);

          _this4.unsubscribeSubmit = _this4.companyForm.onSubmit(function (state, document) {
            _modelsCompanies.companiesActions.update(_this4.companyDocument, document);
            _this4.goBack(true);
          });

          _this4.unsubscribeState = _this4.companyForm.onValue(function (state) {
            _this4.setState({
              canSubmit: state.canSubmit,
              hasBeenModified: state.hasBeenModified
            });
          });
        }
      });

      if (companyId) _modelsCompanies.companiesActions.load({ ids: [companyId] });else _modelsNav.navActions.replace(_routes2['default'].company.list);
    }
  }, {
    key: 'render',
    value: function render() {
      var submitBtn = _react2['default'].createElement(_widgets.UpdateBtn, { onSubmit: this.handleSubmit, canSubmit: this.state.canSubmit && this.state.hasBeenModified });
      var cancelBtn = _react2['default'].createElement(_widgets.CancelBtn, { onCancel: this.handleCancel });

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(EditContent, {
          title: "Edit Company",
          submitBtn: submitBtn,
          cancelBtn: cancelBtn,
          goBack: this.goBack,
          companyDocument: this.companyDocument,
          companyForm: this.companyForm })
      );
    }
  }]);

  var _EditCompanyApp = EditCompanyApp;
  EditCompanyApp = _reactMixin2['default'].decorate(_reactRouter.Lifecycle)(EditCompanyApp) || EditCompanyApp;
  return EditCompanyApp;
})(_react.Component);

exports.EditCompanyApp = EditCompanyApp;

var EditContent = (function (_Component3) {
  _inherits(EditContent, _Component3);

  function EditContent() {
    _classCallCheck(this, EditContent);

    _get(Object.getPrototypeOf(EditContent.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(EditContent, [{
    key: 'render',
    value: function render() {
      var _this5 = this;

      if (!this.props.companyForm) return false;
      var editMode = !!this.props.companyDocument;
      var fake = _immutable2['default'].fromJS(_lodash2['default'].pick(this.props.companyDocument, 'createdAt', 'updatedAt'));
      var styles = {
        time: {
          fontSize: '.7rem',
          fontStyle: 'italic',
          display: 'block',
          float: 'right'
        }
      };

      var note = function note() {
        if (editMode) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_fields.MarkdownEditField, { field: _this5.props.companyForm.field('note') })
        );
      };

      var tags = function tags() {
        if (editMode) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_fields.TagsField, { field: _this5.props.companyForm.field('tags') })
        );
      };

      return _react2['default'].createElement(
        _layout.Content,
        null,
        _react2['default'].createElement(
          'div',
          { className: 'row' },
          _react2['default'].createElement(
            'div',
            { className: 'col-md-12' },
            _react2['default'].createElement(
              _widgets.Header,
              { obj: fake },
              _react2['default'].createElement(
                _widgets.HeaderLeft,
                null,
                _react2['default'].createElement(_widgets.GoBack, { goBack: this.props.goBack }),
                _react2['default'].createElement(_fields.AvatarViewField, { type: "company", obj: this.props.companyForm }),
                _react2['default'].createElement(_widgets.Title, { title: this.props.title })
              ),
              _react2['default'].createElement(
                _widgets.HeaderRight,
                null,
                this.props.submitBtn,
                this.props.cancelBtn,
                _react2['default'].createElement(_widgets.ResetBtn, { obj: this.props.companyForm })
              )
            )
          ),
          _react2['default'].createElement('div', { className: 'col-md-12 m-b' }),
          _react2['default'].createElement(
            'div',
            { className: 'col-md-12' },
            _react2['default'].createElement(
              _widgets.Form,
              null,
              _react2['default'].createElement(
                'div',
                { className: 'row' },
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-9' },
                  _react2['default'].createElement(_fields.InputField, { field: this.props.companyForm.field('name') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-1' },
                  _react2['default'].createElement(_fields.StarField, { field: this.props.companyForm.field('preferred') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-2' },
                  _react2['default'].createElement(_fields.DropdownField, { field: this.props.companyForm.field('type') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_fields.AvatarChooserField, { field: this.props.companyForm.field('avatar') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_fields.InputField, { field: this.props.companyForm.field('website'), isUrl: true })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_fields.InputField, { field: this.props.companyForm.field('address/street') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_fields.InputField, { field: this.props.companyForm.field('address/zipcode') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_fields.CityField, { field: this.props.companyForm.field('address/city') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_fields.CountryField, { field: this.props.companyForm.field('address/country') })
                ),
                tags(),
                note()
              )
            )
          )
        )
      );
    }
  }]);

  return EditContent;
})(_react.Component);

exports['default'] = EditContent;
//# sourceMappingURL=edit.js.map
