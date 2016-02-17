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

var _formsPerson = require('../../forms/person');

var _formsPerson2 = _interopRequireDefault(_formsPerson);

var _modelsPersons = require('../../models/persons');

var _modelsLogin = require('../../models/login');

var _modelsSkills = require('../../models/skills');

var _modelsCompanies = require('../../models/companies');

var _modelsNav = require('../../models/nav');

var _layout = require('../layout');

var _widgets = require('../widgets');

var _fields = require('../fields');

var _phone = require('../phone');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var NewPersonApp = (function (_Component) {
  _inherits(NewPersonApp, _Component);

  function NewPersonApp() {
    var _this = this;

    _classCallCheck(this, _NewPersonApp);

    _get(Object.getPrototypeOf(_NewPersonApp.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      forceLeave: false
    };

    this.routerWillLeave = function (nextLocation) {
      if (!_this.state.forceLeave && _this.state.hasBeenModified) return "Are you sure you want to leave the page without saving new person?";
      return true;
    };

    this.handleSubmit = function () {
      _this.personForm.submit();
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

  _createClass(NewPersonApp, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeSubmit) this.unsubscribeSubmit();
      if (this.unsubscribeState) this.unsubscribeState();
      if (this.unsubscribeCompanies) this.unsubscribeCompanies();
      if (this.unsubscribeSkills) this.unsubscribeSkills();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var companyId = this.props.location.state && this.props.location.state.companyId;
      this.personForm = companyId ? (0, _formsPerson2['default'])({ companyId: companyId }) : (0, _formsPerson2['default'])();

      this.unsubscribeCompanies = _modelsCompanies.companiesStore.listen(function (companies) {
        var companyId = _this2.personForm.field('companyId');
        companyId.setSchemaValue('domainValue', companiesDomain(companies.data));
        _this2.forceUpdate();
      });

      this.unsubscribeSkills = _modelsSkills.skillsStore.listen(function (skills) {
        var skillsField = _this2.personForm.field('skills');
        skillsField.setSchemaValue('domainValue', skills.data.toJS() || []);
        _this2.forceUpdate();
      });

      this.unsubscribeSubmit = this.personForm.onSubmit(function (state, document) {
        _modelsPersons.personsActions.create(document);
        _this2.goBack(true);
      });

      this.unsubscribeState = this.personForm.onValue(function (state) {
        _this2.setState({
          canSubmit: state.canSubmit,
          hasBeenModified: state.hasBeenModified
        });
      });

      _modelsCompanies.companiesActions.load();
      _modelsSkills.skillsActions.load();
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.personForm) return false;

      var submitBtn = _react2['default'].createElement(_widgets.AddBtn, { onSubmit: this.handleSubmit, canSubmit: this.state.canSubmit });
      var cancelBtn = _react2['default'].createElement(_widgets.CancelBtn, { onCancel: this.handleCancel });

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(EditContent, {
          title: "Add a Person",
          submitBtn: submitBtn,
          cancelBtn: cancelBtn,
          goBack: this.goBack,
          personForm: this.personForm })
      );
    }
  }]);

  var _NewPersonApp = NewPersonApp;
  NewPersonApp = _reactMixin2['default'].decorate(_reactRouter.Lifecycle)(NewPersonApp) || NewPersonApp;
  return NewPersonApp;
})(_react.Component);

exports.NewPersonApp = NewPersonApp;

var EditPersonApp = (function (_Component2) {
  _inherits(EditPersonApp, _Component2);

  function EditPersonApp() {
    var _this3 = this;

    _classCallCheck(this, _EditPersonApp);

    _get(Object.getPrototypeOf(_EditPersonApp.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      forceLeave: false
    };

    this.routerWillLeave = function (nextLocation) {
      if (!_this3.state.forceLeave && _this3.state.hasBeenModified) return "Are you sure you want to leave the page without saving updates?";
      return true;
    };

    this.handleSubmit = function () {
      _this3.personForm.submit();
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

  _createClass(EditPersonApp, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeSubmit) this.unsubscribeSubmit();
      if (this.unsubscribeState) this.unsubscribeState();
      if (this.unsubscribeCompanies) this.unsubscribeCompanies();
      if (this.unsubscribeSkills) this.unsubscribeSkills();
      if (this.unsubscribePersons) this.unsubscribePersons();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this4 = this;

      var personId = this.props.location.state && this.props.location.state.personId;

      this.unsubscribePersons = _modelsPersons.personsStore.listen(function (persons) {
        var person = persons.data.get(personId);
        if (!person) return _modelsNav.navActions.replace(_routes2['default'].person.list);
        if (!_this4.personDocument) {
          _this4.personDocument = person.toJS();
          _this4.personForm = (0, _formsPerson2['default'])(_this4.personDocument);

          _this4.unsubscribeCompanies = _modelsCompanies.companiesStore.listen(function (companies) {
            var companyId = _this4.personForm.field('companyId');
            companyId.setSchemaValue('domainValue', companiesDomain(companies.data));
            _this4.forceUpdate();
          });

          _this4.unsubscribeSkills = _modelsSkills.skillsStore.listen(function (skills) {
            var skillsField = _this4.personForm.field('skills');
            skillsField.setSchemaValue('domainValue', skills.data.toJS() || []);
            _this4.forceUpdate();
          });

          _this4.unsubscribeSubmit = _this4.personForm.onSubmit(function (state, document) {
            _modelsPersons.personsActions.update(_this4.personDocument, document);
            _this4.goBack(true);
          });

          _this4.unsubscribeState = _this4.personForm.onValue(function (state) {
            _this4.setState({
              canSubmit: state.canSubmit,
              hasBeenModified: state.hasBeenModified
            });
          });
        }
      });

      if (personId) {
        _modelsPersons.personsActions.load({ ids: [personId] });
        _modelsCompanies.companiesActions.load();
        _modelsSkills.skillsActions.load();
      } else return _modelsNav.navActions.replace(_routes2['default'].person.list);
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.personDocument) return false;

      var submitBtn = _react2['default'].createElement(_widgets.UpdateBtn, { onSubmit: this.handleSubmit, canSubmit: this.state.canSubmit && this.state.hasBeenModified });
      var cancelBtn = _react2['default'].createElement(_widgets.CancelBtn, { onCancel: this.handleCancel });

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(EditContent, {
          title: "Edit Person",
          submitBtn: submitBtn,
          cancelBtn: cancelBtn,
          goBack: this.goBack,
          personDocument: this.personDocument,
          personForm: this.personForm })
      );
    }
  }]);

  var _EditPersonApp = EditPersonApp;
  EditPersonApp = _reactMixin2['default'].decorate(_reactRouter.Lifecycle)(EditPersonApp) || EditPersonApp;
  return EditPersonApp;
})(_react.Component);

exports.EditPersonApp = EditPersonApp;

var EditContent = (function (_Component3) {
  _inherits(EditContent, _Component3);

  function EditContent() {
    _classCallCheck(this, EditContent);

    _get(Object.getPrototypeOf(EditContent.prototype), 'constructor', this).apply(this, arguments);

    this.state = {};
    this.editMode = !!this.props.personDocument;
  }

  _createClass(EditContent, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this5 = this;

      //this.editMode = !!this.props.personDocument;
      // dynamic behavior
      emailRule(this.props.personForm);
      companyRule(this.props.personForm);

      var type = this.props.personForm.field('type');
      type.onValue(function (state) {
        return _this5.setState({ isWorker: state.value === 'worker' });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var person = this.props.personForm;
      if (!person) return false;

      var styles = {
        time: {
          fontSize: '.7rem',
          fontStyle: 'italic',
          display: 'block',
          float: 'right'
        }
      };

      var fakePerson = _immutable2['default'].fromJS(_lodash2['default'].pick(this.props.personDocument, 'createdAt', 'updatedAt'));

      var companyId = person.field('companyId');

      var skills = function skills() {
        if (!_this6.state.isWorker) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_fields.MultiSelectField, { field: person.field('skills'), allowCreate: true })
        );
      };

      var roles = function roles() {
        //if(!this.state.isWorker) return <div/>
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_fields.MultiSelectField, { field: person.field('roles') })
        );
      };

      var note = function note() {
        if (_this6.editMode) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_fields.MarkdownEditField, { field: person.field('note') })
        );
      };

      var tags = function tags() {
        if (_this6.editMode) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_fields.TagsField, { field: person.field('tags') })
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
              { obj: fakePerson },
              _react2['default'].createElement(
                _widgets.HeaderLeft,
                null,
                _react2['default'].createElement(_widgets.GoBack, { goBack: this.props.goBack }),
                _react2['default'].createElement(_fields.AvatarViewField, { type: 'person', obj: person }),
                _react2['default'].createElement(_widgets.Title, { title: this.props.title })
              ),
              _react2['default'].createElement(
                _widgets.HeaderRight,
                null,
                this.props.submitBtn,
                this.props.cancelBtn,
                _react2['default'].createElement(_widgets.ResetBtn, { obj: person })
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
                  { className: 'col-md-3' },
                  _react2['default'].createElement(_fields.DropdownField, { field: person.field('prefix') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_fields.InputField, { field: person.field('firstName') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_fields.InputField, { field: person.field('lastName') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-1' },
                  _react2['default'].createElement(_fields.StarField, { field: person.field('preferred') })
                )
              ),
              _react2['default'].createElement(
                'div',
                { className: 'row' },
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-3' },
                  _react2['default'].createElement(_fields.DropdownField, { field: person.field('type') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-6' },
                  _react2['default'].createElement(_fields.InputField, { field: person.field('email') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-3' },
                  _react2['default'].createElement(_fields.DropdownField, { field: person.field('jobType') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_fields.DropdownField, { field: companyId })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_phone.PhonesField, { field: person.field('phones') })
                ),
                tags(),
                skills(),
                roles(),
                _react2['default'].createElement(AvatarChooser, { person: person }),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_fields.MarkdownEditField, { field: person.field('jobDescription') })
                ),
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

var AvatarChooser = (function (_Component4) {
  _inherits(AvatarChooser, _Component4);

  function AvatarChooser() {
    _classCallCheck(this, AvatarChooser);

    _get(Object.getPrototypeOf(AvatarChooser.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AvatarChooser, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this7 = this;

      var type = this.props.person.field('type');
      type.onValue(function (state) {
        _this7.setState({ value: state.value });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.value === 'worker') {
        return _react2['default'].createElement('div', null);
      } else {
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_fields.AvatarChooserField, { field: this.props.person.field('avatar') })
        );
      }
    }
  }]);

  return AvatarChooser;
})(_react.Component);

function companyRule(person) {
  var type = person.field('type');
  var companyId = person.field('companyId');

  type.onValue(function (state) {
    if (state.value === 'worker') {
      companyId.setValue(_modelsLogin.loginStore.getUser().get('companyId'));
      companyId.disabled(true);
    } else {
      companyId.disabled(false);
    }
  });
}

function emailRule(person) {
  var type = person.field('type');
  var email = person.field('email');

  type.onValue(function (state) {
    if (state.value === 'worker') {
      email.setSchemaValue('required', true);
    } else {
      email.setSchemaValue('required', false);
    }
  });
}

function companiesDomain(companies) {
  if (!companies) return [];
  var values = _lodash2['default'].chain(companies.toJS()).map(function (company) {
    return { key: company._id, value: company.name };
  }).sortBy(function (x) {
    return x.value;
  }).value();
  values.unshift({ key: undefined, value: '<No Company>' });
  return values;
}
//# sourceMappingURL=edit.js.map
