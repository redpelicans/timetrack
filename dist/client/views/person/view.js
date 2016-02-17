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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _widgets = require('../widgets');

var _fields = require('../fields');

var _widgets2 = require('./widgets');

var _missionWidgets = require('../mission/widgets');

var _layout = require('../layout');

var _modelsPersons = require('../../models/persons');

var _modelsMissions = require('../../models/missions');

var _modelsNav = require('../../models/nav');

var _modelsCompanies = require('../../models/companies');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var _notes = require('../notes');

var _notes2 = _interopRequireDefault(_notes);

var _formsTags = require('../../forms/tags');

var _formsTags2 = _interopRequireDefault(_formsTags);

var ViewPersonApp = (function (_Component) {
  _inherits(ViewPersonApp, _Component);

  function ViewPersonApp() {
    _classCallCheck(this, ViewPersonApp);

    _get(Object.getPrototypeOf(ViewPersonApp.prototype), 'constructor', this).apply(this, arguments);

    this.state = {};

    this.goBack = function () {
      _modelsNav.navActions.goBack();
    };
  }

  _createClass(ViewPersonApp, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this = this;

      var personId = this.props.location.state && this.props.location.state.personId;
      if (!personId) _modelsNav.navActions.replace(_routes2['default'].person.list);

      this.unsubscribeCompanies = _modelsCompanies.companiesStore.listen(function (companies) {
        var company = companies.data.get(_this.state.person.get('companyId'));
        _this.setState({ company: company, companies: companies.data });
      });

      this.unsubscribeNav = _modelsNav.navStore.listen(function (state) {
        var newPersonId = state.context && state.context.personId;
        if (newPersonId && personId != newPersonId) {
          personId = newPersonId;
          _modelsPersons.personsActions.load({ ids: [personId] });
        }
      });

      this.unsubscribePersons = _modelsPersons.personsStore.listen(function (persons) {
        var person = persons.data.get(personId);
        if (person) {
          if (!_this.tagsField) {
            _this.tagsField = (0, _formsTags2['default'])({ tags: person.get('tags') }).field('tags');
            _this.unsubscribeTags = _this.tagsField.onValue(function (state) {
              if (state.hasBeenModified) _modelsPersons.personsActions.updateTags(person, state.value);
            });
          }

          if (person != _this.state.person) {
            // if(this.state.person && !_.isEqual(person.get('tags').toJS(), this.state.person.get('tags').toJS())){
            //   console.log("TAGS ARE DIFFERENT")
            // }
            _this.setState({ person: person, persons: persons.data });
          }

          if (_this.unsubscribeMissions) _this.unsubscribeMissions();
          _this.unsubscribeMissions = _modelsMissions.missionsStore.listen(function (state) {
            var missions = state.data.filter(function (mission) {
              return mission.get('managerId') === personId || mission.get('workerIds').toJS().indexOf(personId) !== -1;
            });
            _this.setState({ missions: missions });
          });

          _modelsCompanies.companiesActions.load({ ids: [person.get('companyId')] });
          _modelsMissions.missionsActions.load();
        } else {
          _modelsNav.navActions.replace(_routes2['default'].person.list);
        }
      });

      if (personId) {
        _modelsPersons.personsActions.load({ ids: [personId] });
      } else {
        _modelsNav.navActions.replace(_routes2['default'].person.list);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeMissions) this.unsubscribeMissions();
      if (this.unsubscribeCompanies) this.unsubscribeCompanies();
      if (this.unsubscribePersons) this.unsubscribePersons();
      if (this.unsubscribeTags) this.unsubscribeTags();
      if (this.unsubscribeNav) this.unsubscribeNav();
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.person) return false;
      var person = this.state.person;
      return _react2['default'].createElement(
        _layout.Content,
        null,
        _react2['default'].createElement(
          _widgets.Header,
          { obj: person },
          _react2['default'].createElement(
            _widgets.HeaderLeft,
            null,
            _react2['default'].createElement(_widgets.GoBack, { goBack: this.goBack }),
            _react2['default'].createElement(_widgets.AvatarView, { obj: person }),
            _react2['default'].createElement(_widgets.Title, { title: person.get('name') }),
            _react2['default'].createElement(_widgets2.Preferred, { person: person, active: true })
          ),
          _react2['default'].createElement(
            _widgets.HeaderRight,
            null,
            _react2['default'].createElement(_widgets2.Edit, { person: person }),
            _react2['default'].createElement(_widgets2.Delete, { person: person, postAction: this.goBack })
          )
        ),
        _react2['default'].createElement(Card, {
          person: this.state.person,
          missions: this.state.missions,
          company: this.state.company,
          persons: this.state.persons,
          tags: this.tagsField,
          companies: this.state.companies })
      );
    }
  }]);

  return ViewPersonApp;
})(_react.Component);

exports['default'] = ViewPersonApp;

var Card = function Card(_ref) {
  var person = _ref.person;
  var company = _ref.company;
  var companies = _ref.companies;
  var persons = _ref.persons;
  var missions = _ref.missions;
  var tags = _ref.tags;

  var styles = {
    container: {
      marginTop: '3rem'
    }
  };

  var handleClick = function handleClick(e) {
    e.preventDefault();
    _modelsNav.navActions.push(_routes2['default'].company.view, { companyId: company.get('_id') });
  };

  // const handleClickTag = (tag) => {
  //   navActions.push(sitemap.person.list, {filter: `#${tag} `});
  // }

  var phones = function phones() {
    return _lodash2['default'].map(person.get('phones') && person.get('phones').toJS() || [], function (p) {
      return _react2['default'].createElement(
        'div',
        { key: p.label + p.number, className: 'col-md-4' },
        _react2['default'].createElement(_widgets.TextLabel, { label: 'Phone: ' + p.label, value: p.number })
      );
    });
  };

  var birthdate = function birthdate() {
    var date = person.get('birthdate') ? (0, _moment2['default'])(person.get('birthdate')).format('DD/MM/YY') : "";
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-2' },
      _react2['default'].createElement(_widgets.TextLabel, { label: 'Birth Date', value: date })
    );
  };

  var companyElement = function companyElement() {
    if (!company) return _react2['default'].createElement('div', null);
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_widgets.TextLabel, {
        label: 'Company',
        onClick: handleClick,
        value: company && company.get('name') })
    );
  };

  var jobDescription = function jobDescription() {
    if (!person.get('jobDescription')) return _react2['default'].createElement('div', null);
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_widgets.MarkdownText, { label: 'Job Description', value: person.get('jobDescription') })
    );
  };

  var skills = function skills() {
    if (!person.get('skills') || !person.get('skills').size) return _react2['default'].createElement('div', null);
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_widgets.Labels, { label: 'Skills', value: person.get('skills') })
    );
  };

  var editTags = function editTags() {
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_fields.TagsField, { field: tags })
    );
  };

  var roles = function roles() {
    if (!person.get('roles') || !person.get('roles').size) return _react2['default'].createElement('div', null);
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_widgets.Labels, { label: 'Roles', value: person.get('roles') })
    );
  };

  var type = function type() {
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-3' },
      _react2['default'].createElement(_widgets.TextLabel, { label: 'Type', value: person.get('type') })
    );
  };

  var jobType = function jobType() {
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-3' },
      _react2['default'].createElement(_widgets.TextLabel, { label: 'Job Type', value: person.get('jobType') })
    );
  };

  var email = function email() {
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-6' },
      _react2['default'].createElement(_widgets.TextLabel, { label: 'Email', value: person.get('email') })
    );
  };

  return _react2['default'].createElement(
    'div',
    null,
    _react2['default'].createElement(
      'div',
      { style: styles.container, className: 'row' },
      _react2['default'].createElement(
        'div',
        { className: 'col-md-1' },
        _react2['default'].createElement(_widgets.TextLabel, { label: 'Prefix', value: person.get('prefix') })
      ),
      _react2['default'].createElement(
        'div',
        { className: 'col-md-5' },
        _react2['default'].createElement(_widgets.TextLabel, { label: 'First Name', value: person.get('firstName') })
      ),
      _react2['default'].createElement(
        'div',
        { className: 'col-md-6' },
        _react2['default'].createElement(_widgets.TextLabel, { label: 'Last Name', value: person.get('lastName') })
      ),
      companyElement()
    ),
    _react2['default'].createElement(
      'div',
      { className: 'row' },
      type(),
      jobType(),
      email()
    ),
    _react2['default'].createElement(
      'div',
      { className: 'row' },
      phones()
    ),
    _react2['default'].createElement(
      'div',
      { className: 'row' },
      skills(),
      roles()
    ),
    _react2['default'].createElement(
      'div',
      { className: 'row' },
      jobDescription()
    ),
    _react2['default'].createElement(
      'div',
      { className: 'row' },
      _react2['default'].createElement(
        'div',
        { className: 'col-md-12' },
        _react2['default'].createElement(Missions, {
          label: 'Missions',
          companies: companies,
          persons: persons,
          missions: missions })
      )
    ),
    _react2['default'].createElement(
      'div',
      { className: 'row' },
      editTags()
    ),
    _react2['default'].createElement(
      'div',
      { className: 'row' },
      _react2['default'].createElement(
        'div',
        { className: 'col-md-12' },
        _react2['default'].createElement(_notes2['default'], { entity: person })
      )
    )
  );
};

var Missions = function Missions(_ref2) {
  var label = _ref2.label;
  var missions = _ref2.missions;
  var companies = _ref2.companies;
  var persons = _ref2.persons;

  if (!missions || !missions.size) return _react2['default'].createElement('div', null);

  var styles = {
    container: {
      //marginBottom: '50px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    item: {
      height: '80px'
    }
  };

  var data = missions.sort(function (a, b) {
    return b.get('startDate') > a.get('startDate');
  }).map(function (mission) {
    var company = companies.get(mission.get('clientId'));
    var workers = persons ? persons.filter(function (person) {
      return mission.get('workerIds').indexOf(person.get('_id')) !== -1;
    }) : null;
    return _react2['default'].createElement(
      'div',
      { key: mission.get('_id'), className: 'col-md-6 tm list-item', style: styles.item },
      _react2['default'].createElement(
        _missionWidgets.Preview,
        {
          mission: mission,
          manager: persons.get(mission.get('managerId')),
          workers: workers,
          company: company },
        _react2['default'].createElement(_missionWidgets.Edit, { mission: mission }),
        _react2['default'].createElement(_missionWidgets.Closed, { mission: mission })
      )
    );
  }).toSetSeq();

  return _react2['default'].createElement(
    'fieldset',
    { className: 'form-group' },
    _react2['default'].createElement(
      'label',
      null,
      ' ',
      label,
      ' '
    ),
    _react2['default'].createElement(
      'div',
      { className: 'row', style: styles.container },
      data
    )
  );
};
module.exports = exports['default'];
//# sourceMappingURL=view.js.map
