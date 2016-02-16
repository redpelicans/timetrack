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

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _formsCompany = require('../../forms/company');

var _formsCompany2 = _interopRequireDefault(_formsCompany);

var _componentsLayout = require('../../components/layout');

var _componentsWidgets = require('../../components/widgets');

var _componentsFields = require('../../components/fields');

var _cities = require('../cities');

var _cities2 = _interopRequireDefault(_cities);

var _countries = require('../countries');

var _countries2 = _interopRequireDefault(_countries);

var _tags = require('../tags');

var _tags2 = _interopRequireDefault(_tags);

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var _actionsCompanies = require('../../actions/companies');

var _actionsRoutes = require('../../actions/routes');

var _selectorsCompanies = require('../../selectors/companies');

var NewCompany = (function (_Component) {
  _inherits(NewCompany, _Component);

  function NewCompany() {
    var _this = this;

    _classCallCheck(this, NewCompany);

    _get(Object.getPrototypeOf(NewCompany.prototype), 'constructor', this).apply(this, arguments);

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
        _this.props.dispatch((0, _actionsRoutes.goBack)());
      });
    };
  }

  _createClass(NewCompany, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var route = this.props.route;
      var router = this.context.router;

      router.setRouteLeaveHook(route, this.routerWillLeave);
    }
  }, {
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
        _this2.props.dispatch(_actionsCompanies.companiesActions.create(document));
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
      var submitBtn = _react2['default'].createElement(_componentsWidgets.AddBtn, { onSubmit: this.handleSubmit, canSubmit: this.state.canSubmit });
      var cancelBtn = _react2['default'].createElement(_componentsWidgets.CancelBtn, { onCancel: this.handleCancel });

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
  }]);

  return NewCompany;
})(_react.Component);

NewCompany.contextTypes = {
  router: _react.PropTypes.object.isRequired
};

NewCompany.propTypes = {
  dispatch: _react.PropTypes.func.isRequired
};

var EditCompany = (function (_Component2) {
  _inherits(EditCompany, _Component2);

  function EditCompany() {
    var _this3 = this;

    _classCallCheck(this, EditCompany);

    _get(Object.getPrototypeOf(EditCompany.prototype), 'constructor', this).apply(this, arguments);

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
        _this3.props.dispatch((0, _actionsRoutes.goBack)());
      });
    };
  }

  _createClass(EditCompany, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var route = this.props.route;
      var router = this.context.router;

      router.setRouteLeaveHook(route, this.routerWillLeave);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeSubmit) this.unsubscribeSubmit();
      if (this.unsubscribeState) this.unsubscribeState();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this4 = this;

      var _props = this.props;
      var company = _props.company;
      var dispatch = _props.dispatch;

      if (!company) dispatch((0, _actionsRoutes.replaceRoute)(_routes2['default'].company.list));

      this.companyDocument = company.toJS();
      this.companyForm = (0, _formsCompany2['default'])(this.companyDocument);

      this.unsubscribeSubmit = this.companyForm.onSubmit(function (state, document) {
        dispatch(_actionsCompanies.companiesActions.update(_this4.companyDocument, document));
        _this4.goBack(true);
      });

      this.unsubscribeState = this.companyForm.onValue(function (state) {
        _this4.setState({
          canSubmit: state.canSubmit,
          hasBeenModified: state.hasBeenModified
        });
      });

      //dispatch(companiesActions.load({ids: [companyId]}));
    }
  }, {
    key: 'render',
    value: function render() {
      var submitBtn = _react2['default'].createElement(_componentsWidgets.UpdateBtn, { onSubmit: this.handleSubmit, canSubmit: this.state.canSubmit && this.state.hasBeenModified });
      var cancelBtn = _react2['default'].createElement(_componentsWidgets.CancelBtn, { onCancel: this.handleCancel });

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

  return EditCompany;
})(_react.Component);

EditCompany.contextTypes = {
  router: _react.PropTypes.object.isRequired
};

EditCompany.propTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  company: _react.PropTypes.object
};

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
          _react2['default'].createElement(_componentsFields.MarkdownEditField, { field: _this5.props.companyForm.field('note') })
        );
      };

      var tags = function tags() {
        if (editMode) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_tags2['default'], { field: _this5.props.companyForm.field('tags') })
        );
      };

      return _react2['default'].createElement(
        _componentsLayout.Content,
        null,
        _react2['default'].createElement(
          'div',
          { className: 'row' },
          _react2['default'].createElement(
            'div',
            { className: 'col-md-12' },
            _react2['default'].createElement(
              _componentsWidgets.Header,
              { obj: fake },
              _react2['default'].createElement(
                _componentsWidgets.HeaderLeft,
                null,
                _react2['default'].createElement(_componentsWidgets.GoBack, { goBack: this.props.goBack }),
                _react2['default'].createElement(_componentsFields.AvatarViewField, { type: "company", obj: this.props.companyForm }),
                _react2['default'].createElement(_componentsWidgets.Title, { title: this.props.title })
              ),
              _react2['default'].createElement(
                _componentsWidgets.HeaderRight,
                null,
                this.props.submitBtn,
                this.props.cancelBtn,
                _react2['default'].createElement(_componentsWidgets.ResetBtn, { obj: this.props.companyForm })
              )
            )
          ),
          _react2['default'].createElement('div', { className: 'col-md-12 m-b' }),
          _react2['default'].createElement(
            'div',
            { className: 'col-md-12' },
            _react2['default'].createElement(
              _componentsWidgets.Form,
              null,
              _react2['default'].createElement(
                'div',
                { className: 'row' },
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-9' },
                  _react2['default'].createElement(_componentsFields.InputField, { field: this.props.companyForm.field('name') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-1' },
                  _react2['default'].createElement(_componentsFields.StarField, { field: this.props.companyForm.field('preferred') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-2' },
                  _react2['default'].createElement(_componentsFields.DropdownField, { field: this.props.companyForm.field('type') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_componentsFields.AvatarChooserField, { field: this.props.companyForm.field('avatar') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_componentsFields.InputField, { field: this.props.companyForm.field('website'), isUrl: true })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_componentsFields.InputField, { field: this.props.companyForm.field('address/street') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_componentsFields.InputField, { field: this.props.companyForm.field('address/zipcode') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_cities2['default'], { field: this.props.companyForm.field('address/city') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_countries2['default'], { field: this.props.companyForm.field('address/country') })
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

EditContent.propTypes = {
  title: _react.PropTypes.string.isRequired,
  submitBtn: _react.PropTypes.element.isRequired,
  cancelBtn: _react.PropTypes.element.isRequired,
  goBack: _react.PropTypes.func.isRequired,
  companyForm: _react.PropTypes.object.isRequired,
  companyDocument: _react.PropTypes.object
};
var NewCompanyApp = (0, _reactRedux.connect)()(NewCompany);
exports.NewCompanyApp = NewCompanyApp;
var EditCompanyApp = (0, _reactRedux.connect)(_selectorsCompanies.editCompanySelector)(EditCompany);
exports.EditCompanyApp = EditCompanyApp;
//# sourceMappingURL=edit.js.map
