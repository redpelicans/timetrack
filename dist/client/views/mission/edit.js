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

var _formsMission = require('../../forms/mission');

var _formsMission2 = _interopRequireDefault(_formsMission);

var _modelsMissions = require('../../models/missions');

var _modelsLogin = require('../../models/login');

var _modelsNav = require('../../models/nav');

var _modelsCompanies = require('../../models/companies');

var _modelsPersons = require('../../models/persons');

var _layout = require('../layout');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var _widgets = require('../widgets');

var _fields = require('../fields');

var NewMissionApp = (function (_Component) {
  _inherits(NewMissionApp, _Component);

  function NewMissionApp() {
    var _this = this;

    _classCallCheck(this, _NewMissionApp);

    _get(Object.getPrototypeOf(_NewMissionApp.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      forceLeave: false
    };

    this.routerWillLeave = function (nextLocation) {
      if (!_this.state.forceLeave && _this.state.hasBeenModified) return "Are you sure you want to leave the page without saving new mission?";
      return true;
    };

    this.handleSubmit = function () {
      _this.missionForm.submit();
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

  _createClass(NewMissionApp, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeSubmit) this.unsubscribeSubmit();
      if (this.unsubscribeState) this.unsubscribeState();
      if (this.unsubscribeCompanies) this.unsubscribeCompanies();
      if (this.unsubscribePersons) this.unsubscribePersons();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var clientId = this.props.location.state && this.props.location.state.clientId;
      this.missionForm = clientId ? (0, _formsMission2['default'])({ clientId: clientId }) : (0, _formsMission2['default'])();

      this.unsubscribeCompanies = _modelsCompanies.companiesStore.listen(function (companies) {
        var clientIdField = _this2.missionForm.field('clientId');
        clientIdField.setSchemaValue('domainValue', clientsDomain(companies.data));
        _this2.setState({ companies: companies.data });
      });

      this.unsubscribePersons = _modelsPersons.personsStore.listen(function (persons) {
        var managerIdField = _this2.missionForm.field('managerId');
        managerIdField.setSchemaValue('domainValue', workersDomain(persons.data));

        var workerIdsField = _this2.missionForm.field('workerIds');
        workerIdsField.setSchemaValue('domainValue', workersDomain(persons.data));

        _this2.setState({ persons: persons.data });
      });

      this.unsubscribeSubmit = this.missionForm.onSubmit(function (state, mission) {
        _modelsMissions.missionsActions.create(mission);
        _this2.goBack(true);
      });

      this.unsubscribeState = this.missionForm.onValue(function (state) {
        _this2.setState({
          canSubmit: state.canSubmit,
          hasBeenModified: state.hasBeenModified
        });
      });

      _modelsCompanies.companiesActions.load();
      _modelsPersons.personsActions.load();
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.companies) return false;
      var submitBtn = _react2['default'].createElement(_widgets.AddBtn, { onSubmit: this.handleSubmit, canSubmit: this.state.canSubmit });
      var cancelBtn = _react2['default'].createElement(_widgets.CancelBtn, { onCancel: this.handleCancel });

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(EditContent, {
          title: "Add a Mission",
          submitBtn: submitBtn,
          cancelBtn: cancelBtn,
          goBack: this.goBack,
          clients: this.state.companies,
          missionForm: this.missionForm })
      );
    }
  }], [{
    key: 'contextTypes',
    value: {
      history: _react2['default'].PropTypes.object.isRequired
    },
    enumerable: true
  }]);

  var _NewMissionApp = NewMissionApp;
  NewMissionApp = _reactMixin2['default'].decorate(_reactRouter.Lifecycle)(NewMissionApp) || NewMissionApp;
  return NewMissionApp;
})(_react.Component);

exports.NewMissionApp = NewMissionApp;

var EditMissionApp = (function (_Component2) {
  _inherits(EditMissionApp, _Component2);

  function EditMissionApp() {
    var _this3 = this;

    _classCallCheck(this, _EditMissionApp);

    _get(Object.getPrototypeOf(_EditMissionApp.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      forceLeave: false
    };

    this.routerWillLeave = function (nextLocation) {
      if (!_this3.state.forceLeave && _this3.state.hasBeenModified) return "Are you sure you want to leave the page without saving updates?";
      return true;
    };

    this.handleSubmit = function () {
      _this3.missionForm.submit();
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

  _createClass(EditMissionApp, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeSubmit) this.unsubscribeSubmit();
      if (this.unsubscribeState) this.unsubscribeState();
      if (this.unsubscribeMissions) this.unsubscribeMissions();
      if (this.unsubscribeCompanies) this.unsubscribeCompanies();
      if (this.unsubscribePersons) this.unsubscribePersons();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this4 = this;

      var missionId = this.props.location.state && this.props.location.state.missionId;

      this.unsubscribeMissions = _modelsMissions.missionsStore.listen(function (missions) {
        var mission = missions.data.get(missionId);
        if (!mission) return _modelsNav.navActions.replace(_routes2['default'].mission.list);
        if (!_this4.missionDocument) {
          _this4.missionDocument = mission.toJS();
          _this4.missionForm = (0, _formsMission2['default'])(_this4.missionDocument);

          _this4.unsubscribeCompanies = _modelsCompanies.companiesStore.listen(function (companies) {
            var clientIdField = _this4.missionForm.field('clientId');
            clientIdField.setSchemaValue('domainValue', clientsDomain(companies.data));
            _this4.setState({ companies: companies.data });
          });

          _this4.unsubscribePersons = _modelsPersons.personsStore.listen(function (persons) {
            var managerIdField = _this4.missionForm.field('managerId');
            managerIdField.setSchemaValue('domainValue', workersDomain(persons.data));

            var workerIdsField = _this4.missionForm.field('workerIds');
            workerIdsField.setSchemaValue('domainValue', workersDomain(persons.data));

            _this4.setState({ persons: persons.data });
          });

          _this4.unsubscribeSubmit = _this4.missionForm.onSubmit(function (state, mission) {
            _modelsMissions.missionsActions.update(_this4.missionDocument, mission);
            _this4.goBack(true);
          });

          _this4.unsubscribeState = _this4.missionForm.onValue(function (state) {
            _this4.setState({
              canSubmit: state.canSubmit,
              hasBeenModified: state.hasBeenModified
            });
          });

          _modelsCompanies.companiesActions.load();
          _modelsPersons.personsActions.load();
        }
      });

      if (missionId) _modelsMissions.missionsActions.load({ ids: [missionId] });else _modelsNav.navActions.replace(_routes2['default'].mission.list);
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.missionForm || !this.state.companies) return false;
      var submitBtn = _react2['default'].createElement(_widgets.UpdateBtn, { onSubmit: this.handleSubmit, canSubmit: this.state.canSubmit && this.state.hasBeenModified });
      var cancelBtn = _react2['default'].createElement(_widgets.CancelBtn, { onCancel: this.handleCancel });

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(EditContent, {
          title: "Edit Mission",
          submitBtn: submitBtn,
          cancelBtn: cancelBtn,
          goBack: this.goBack,
          clients: this.state.companies,
          missionDocument: this.missionDocument,
          missionForm: this.missionForm })
      );
    }
  }]);

  var _EditMissionApp = EditMissionApp;
  EditMissionApp = _reactMixin2['default'].decorate(_reactRouter.Lifecycle)(EditMissionApp) || EditMissionApp;
  return EditMissionApp;
})(_react.Component);

exports.EditMissionApp = EditMissionApp;

var EditContent = (function (_Component3) {
  _inherits(EditContent, _Component3);

  function EditContent() {
    _classCallCheck(this, EditContent);

    _get(Object.getPrototypeOf(EditContent.prototype), 'constructor', this).apply(this, arguments);

    this.state = {};
    this.editMode = !!this.props.missionDocument;
  }

  _createClass(EditContent, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribe();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this5 = this;

      var clientIdField = this.props.missionForm.field('clientId');
      this.unsubscribe = clientIdField.onValue(function (state) {
        var client = _this5.props.clients.get(state.value);
        _this5.setState({ client: client });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      if (!this.props.missionForm) return false;

      var fake = _immutable2['default'].fromJS(_lodash2['default'].pick(this.props.missionDocument, 'createdAt', 'updatedAt'));
      var styles = {
        time: {
          fontSize: '.7rem',
          fontStyle: 'italic',
          display: 'block',
          float: 'right'
        }
      };
      var note = function note() {
        if (_this6.editMode) return;
        return _react2['default'].createElement(
          'div',
          { className: 'row' },
          _react2['default'].createElement(
            'div',
            { className: 'col-md-12' },
            _react2['default'].createElement(_fields.MarkdownEditField, { field: _this6.props.missionForm.field('note') })
          )
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
                _react2['default'].createElement(_widgets.AvatarView, { obj: this.state.client }),
                _react2['default'].createElement(_widgets.Title, { title: this.props.title })
              ),
              _react2['default'].createElement(
                _widgets.HeaderRight,
                null,
                this.props.submitBtn,
                this.props.cancelBtn,
                _react2['default'].createElement(_widgets.ResetBtn, { obj: this.props.missionForm })
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
                  { className: 'col-md-6' },
                  _react2['default'].createElement(_fields.DropdownField, { field: this.props.missionForm.field('clientId') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-6' },
                  _react2['default'].createElement(_fields.DropdownField, { field: this.props.missionForm.field('managerId') })
                )
              ),
              _react2['default'].createElement(
                'div',
                { className: 'row' },
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_fields.InputField, { field: this.props.missionForm.field('name') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-4' },
                  _react2['default'].createElement(_fields.PeriodField, {
                    startDate: this.props.missionForm.field('startDate'),
                    endDate: this.props.missionForm.field('endDate') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-2' },
                  _react2['default'].createElement(_fields.DropdownField, { field: this.props.missionForm.field('timesheetUnit') })
                ),
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-2' },
                  _react2['default'].createElement(_fields.DropdownField, { field: this.props.missionForm.field('allowWeekends') })
                )
              ),
              _react2['default'].createElement(
                'div',
                { className: 'row' },
                _react2['default'].createElement(
                  'div',
                  { className: 'col-md-12' },
                  _react2['default'].createElement(_fields.MultiSelectField2, { field: this.props.missionForm.field('workerIds') })
                )
              ),
              note()
            )
          )
        )
      );
    }
  }]);

  return EditContent;
})(_react.Component);

exports['default'] = EditContent;

function clientsDomain(companies) {
  if (!companies) return [];
  var values = _lodash2['default'].chain(companies.toJS()).filter(function (company) {
    return company.type === 'client' || company.type === 'partner';
  }).map(function (company) {
    return { key: company._id, value: company.name };
  }).sortBy(function (x) {
    return x.value;
  }).value();
  return values;
}

function workersDomain(persons) {
  if (!persons) return [];
  var values = _lodash2['default'].chain(persons.toJS()).filter(function (person) {
    return person.type === 'worker';
  }).map(function (person) {
    return { key: person._id, value: person.name };
  }).sortBy(function (x) {
    return x.value;
  }).value();
  return values;
}
//# sourceMappingURL=edit.js.map
