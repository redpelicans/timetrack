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

var _formsPerson = require('../../forms/person');

var _formsPerson2 = _interopRequireDefault(_formsPerson);

var _actionsPersons = require('../../actions/persons');

var _actionsSkills = require('../../actions/skills');

var _actionsCompanies = require('../../actions/companies');

var _actionsRoutes = require('../../actions/routes');

var _componentsLayout = require('../../components/layout');

var _componentsWidgets = require('../../components/widgets');

var _componentsFields = require('../../components/fields');

var _tags = require('../tags');

var _tags2 = _interopRequireDefault(_tags);

var _componentsPhone = require('../../components/phone');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var _selectorsPersons = require('../../selectors/persons');

var NewPerson = (function (_Component) {
  _inherits(NewPerson, _Component);

  function NewPerson() {
    var _this = this;

    _classCallCheck(this, NewPerson);

    _get(Object.getPrototypeOf(NewPerson.prototype), 'constructor', this).apply(this, arguments);

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
        _this.props.dispatch((0, _actionsRoutes.goBack)());
      });
    };
  }

  _createClass(NewPerson, [{
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

      var _props = this.props;
      var dispatch = _props.dispatch;
      var companyId = _props.companyId;
      var companies = _props.companies;
      var skills = _props.skills;

      this.personForm = companyId ? (0, _formsPerson2['default'])({ companyId: companyId }) : (0, _formsPerson2['default'])();

      this.unsubscribeSubmit = this.personForm.onSubmit(function (state, document) {
        dispatch(_actionsPersons.personsActions.create(document));
        _this2.goBack(true);
      });

      this.unsubscribeState = this.personForm.onValue(function (state) {
        _this2.setState({
          canSubmit: state.canSubmit,
          hasBeenModified: state.hasBeenModified
        });
      });

      var companyField = this.personForm.field('companyId');
      var skillsField = this.personForm.field('skills');
      companyField.setSchemaValue('domainValue', companiesDomain(companies));
      skillsField.setSchemaValue('domainValue', skills.toJS() || []);

      dispatch(_actionsCompanies.companiesActions.load());
      dispatch(_actionsSkills.skillsActions.load());
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var userCompanyId = _props2.userCompanyId;
      var companies = _props2.companies;

      var submitBtn = _react2['default'].createElement(_componentsWidgets.AddBtn, { onSubmit: this.handleSubmit, canSubmit: this.state.canSubmit });
      var cancelBtn = _react2['default'].createElement(_componentsWidgets.CancelBtn, { onCancel: this.handleCancel });

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(EditContent, {
          userCompanyId: userCompanyId,
          companies: companies,
          title: "Add a Person",
          submitBtn: submitBtn,
          cancelBtn: cancelBtn,
          goBack: this.goBack,
          personForm: this.personForm })
      );
    }
  }]);

  return NewPerson;
})(_react.Component);

NewPerson.contextTypes = {
  router: _react.PropTypes.object.isRequired
};

NewPerson.propTypes = {
  userCompanyId: _react.PropTypes.string,
  companyId: _react.PropTypes.string,
  companies: _react.PropTypes.object,
  skills: _react.PropTypes.object,
  dispatch: _react.PropTypes.func.isRequired
};

var EditPerson = (function (_Component2) {
  _inherits(EditPerson, _Component2);

  function EditPerson() {
    var _this3 = this;

    _classCallCheck(this, EditPerson);

    _get(Object.getPrototypeOf(EditPerson.prototype), 'constructor', this).apply(this, arguments);

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
        _this3.props.dispatch((0, _actionsRoutes.goBack)());
      });
    };
  }

  _createClass(EditPerson, [{
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

      var _props3 = this.props;
      var dispatch = _props3.dispatch;
      var person = _props3.person;
      var companies = _props3.companies;
      var skills = _props3.skills;

      if (!person) return dispatch((0, _actionsRoutes.replace)(_routes2['default'].person.list));

      this.personDocument = person.toJS();
      this.personForm = (0, _formsPerson2['default'])(this.personDocument);

      this.unsubscribeSubmit = this.personForm.onSubmit(function (state, document) {
        dispatch(_actionsPersons.personsActions.update(_this4.personDocument, document));
        _this4.goBack(true);
      });

      this.unsubscribeState = this.personForm.onValue(function (state) {
        _this4.setState({
          canSubmit: state.canSubmit,
          hasBeenModified: state.hasBeenModified
        });
      });

      var companyField = this.personForm.field('companyId');
      var skillsField = this.personForm.field('skills');
      companyField.setSchemaValue('domainValue', companiesDomain(companies));
      skillsField.setSchemaValue('domainValue', skills.toJS() || []);

      dispatch(_actionsPersons.personsActions.load({ ids: [person.get('_id')] }));
      dispatch(_actionsCompanies.companiesActions.load());
      dispatch(_actionsSkills.skillsActions.load());
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props;
      var userCompanyId = _props4.userCompanyId;
      var companies = _props4.companies;

      if (!this.personDocument) return false;

      var submitBtn = _react2['default'].createElement(_componentsWidgets.UpdateBtn, { onSubmit: this.handleSubmit, canSubmit: this.state.canSubmit && this.state.hasBeenModified });
      var cancelBtn = _react2['default'].createElement(_componentsWidgets.CancelBtn, { onCancel: this.handleCancel });

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(EditContent, {
          userCompanyId: userCompanyId,
          companies: companies,
          title: "Edit Person",
          submitBtn: submitBtn,
          cancelBtn: cancelBtn,
          goBack: this.goBack,
          personDocument: this.personDocument,
          personForm: this.personForm })
      );
    }
  }]);

  return EditPerson;
})(_react.Component);

EditPerson.contextTypes = {
  router: _react.PropTypes.object.isRequired
};

EditPerson.propTypes = {
  userCompanyId: _react.PropTypes.string,
  person: _react.PropTypes.object,
  company: _react.PropTypes.object,
  companies: _react.PropTypes.object,
  skills: _react.PropTypes.object,
  dispatch: _react.PropTypes.func.isRequired
};

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

      //this.editMode = !!this.props.personDocument
      // dynamic behavior
      emailRule(this.props.personForm);
      companyRule(this.props.personForm, this.props.userCompanyId, this.props.companies);

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

      var companyField = person.field('companyId');

      var skills = function skills() {
        if (!_this6.state.isWorker) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_componentsFields.MultiSelectField, { field: person.field('skills'), allowCreate: true })
        );
      };

      var roles = function roles() {
        //if(!this.state.isWorker) return <div/>
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_componentsFields.MultiSelectField, { field: person.field('roles') })
        );
      };

      var note = function note() {
        if (_this6.editMode) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_componentsFields.MarkdownEditField, { field: person.field('note') })
        );
      };

      var tags = function tags() {
        if (_this6.editMode) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(_tags2['default'], { field: person.field('tags') })
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
              { obj: fakePerson },
              _react2['default'].createElement(
                _componentsWidgets.HeaderLeft,
                null,
                _react2['default'].createElement(_componentsWidgets.GoBack, { goBack: this.props.goBack }),
                _react2['default'].createElement(_componentsFields.AvatarViewField, { type: 'person', obj: person }),
                _react2['default'].createElement(_componentsWidgets.Title, { title: this.props.title })
              ),
              _react2['default'].createElement(
                _componentsWidgets.HeaderRight,
                null,
                this.props.submitBtn,
                this.props.cancelBtn,
                _react2['default'].createElement(_componentsWidgets.ResetBtn, { obj: person })
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
                  { className: 'col-md-3' },
                  _react2['default'].createElement(_componentsFields.DropdownField, { field: person.field('prefix') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_componentsFields.InputField, { field: person.field('firstName') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_componentsFields.InputField, { field: person.field('lastName') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-1' },
                  _react2['default'].createElement(_componentsFields.StarField, { field: person.field('preferred') })
                )
              ),
              _react2['default'].createElement(
                'div',
                { className: 'row' },
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-3' },
                  _react2['default'].createElement(_componentsFields.DropdownField, { field: person.field('type') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-6' },
                  _react2['default'].createElement(_componentsFields.InputField, { field: person.field('email') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-3' },
                  _react2['default'].createElement(_componentsFields.DropdownField, { field: person.field('jobType') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_componentsFields.DropdownField, { field: companyField })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_componentsPhone.PhonesField, { field: person.field('phones') })
                ),
                tags(),
                skills(),
                roles(),
                _react2['default'].createElement(AvatarChooser, { person: person }),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_componentsFields.MarkdownEditField, { field: person.field('jobDescription') })
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

EditContent.propTypes = {
  title: _react.PropTypes.string.isRequired,
  submitBtn: _react.PropTypes.element.isRequired,
  cancelBtn: _react.PropTypes.element.isRequired,
  goBack: _react.PropTypes.func.isRequired,
  personForm: _react.PropTypes.object.isRequired,
  userCompanyId: _react.PropTypes.string.isRequired,
  companies: _react.PropTypes.object.isRequired,
  personDocument: _react.PropTypes.object
};

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
          _react2['default'].createElement(_componentsFields.AvatarChooserField, { field: this.props.person.field('avatar') })
        );
      }
    }
  }]);

  return AvatarChooser;
})(_react.Component);

AvatarChooser.propTypes = {
  person: _react.PropTypes.object.isRequired
};

function companyRule(person, userCompanyId, companies) {
  var type = person.field('type');
  var companyField = person.field('companyId');

  type.onValue(function (state) {
    if (state.value === 'worker') {
      companyField.setValue(userCompanyId);
      companyField.disabled(true);
    } else {
      companyField.disabled(false);
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

var NewPersonApp = (0, _reactRedux.connect)(_selectorsPersons.newPersonSelector)(NewPerson);
exports.NewPersonApp = NewPersonApp;
var EditPersonApp = (0, _reactRedux.connect)(_selectorsPersons.editPersonSelector)(EditPerson);
exports.EditPersonApp = EditPersonApp;
//# sourceMappingURL=edit.js.map
