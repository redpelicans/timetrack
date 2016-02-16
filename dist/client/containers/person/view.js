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

var _reactRedux = require('react-redux');

var _actionsRoutes = require('../../actions/routes');

var _componentsWidgets = require('../../components/widgets');

var _componentsPersonWidgets = require('../../components/person/widgets');

var _componentsMissionWidgets = require('../../components/mission/widgets');

var _componentsLayout = require('../../components/layout');

var _selectorsPersons = require('../../selectors/persons');

var _actionsPersons = require('../../actions/persons');

var _actionsCompanies = require('../../actions/companies');

var _actionsMissions = require('../../actions/missions');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var _notes = require('../notes');

var _notes2 = _interopRequireDefault(_notes);

var _tags = require('../tags');

var _tags2 = _interopRequireDefault(_tags);

var _formsTags = require('../../forms/tags');

var _formsTags2 = _interopRequireDefault(_formsTags);

var ViewPerson = (function (_Component) {
  _inherits(ViewPerson, _Component);

  function ViewPerson() {
    var _this = this;

    _classCallCheck(this, ViewPerson);

    _get(Object.getPrototypeOf(ViewPerson.prototype), 'constructor', this).apply(this, arguments);

    this.goBack = function () {
      _this.props.dispatch(_actionsRoutes.routeActions.goBack());
    };
  }

  _createClass(ViewPerson, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props;
      var person = _props.person;
      var dispatch = _props.dispatch;

      if (!person) dispatch(_actionsRoutes.routeActions.replace(_routes2['default'].person.list));

      this.tagsField = (0, _formsTags2['default'])({ tags: person.get('tags') }).field('tags');
      this.unsubscribeTagsField = this.tagsField.onValue(function (state) {
        if (state.hasBeenModified) dispatch(_actionsPersons.personsActions.updateTags(person.toJS(), state.value));
      });

      dispatch(_actionsPersons.personsActions.load());
      dispatch(_actionsMissions.missionsActions.load());
      dispatch(_actionsCompanies.companiesActions.load());
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeTagsField) this.unsubscribeTagsField();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var person = _props2.person;
      var company = _props2.company;
      var missions = _props2.missions;
      var companies = _props2.companies;
      var persons = _props2.persons;
      var isLoading = _props2.isLoading;
      var dispatch = _props2.dispatch;

      if (!person) return false;
      return _react2['default'].createElement(
        _componentsLayout.Content,
        null,
        _react2['default'].createElement(
          _componentsWidgets.Header,
          { obj: person },
          _react2['default'].createElement(
            _componentsWidgets.HeaderLeft,
            null,
            _react2['default'].createElement(_componentsWidgets.GoBack, { goBack: this.goBack, isLoading: isLoading }),
            _react2['default'].createElement(_componentsWidgets.AvatarView, { obj: person }),
            _react2['default'].createElement(_componentsWidgets.Title, { title: person.get('name') }),
            _react2['default'].createElement(_componentsPersonWidgets.Preferred, { person: person, active: true })
          ),
          _react2['default'].createElement(
            _componentsWidgets.HeaderRight,
            null,
            _react2['default'].createElement(_componentsPersonWidgets.Edit, { person: person }),
            _react2['default'].createElement(_componentsPersonWidgets.Delete, { person: person, postAction: this.goBack })
          )
        ),
        _react2['default'].createElement(Card, {
          person: person,
          missions: missions,
          company: company,
          persons: persons,
          tagsField: this.tagsField,
          companies: companies,
          dispatch: dispatch
        })
      );
    }
  }]);

  return ViewPerson;
})(_react.Component);

ViewPerson.PropTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  person: _react.PropTypes.object,
  company: _react.PropTypes.object,
  missions: _react.PropTypes.object,
  companies: _react.PropTypes.object,
  persons: _react.PropTypes.object,
  isLoading: _react.PropTypes.bool
};

var Card = function Card(_ref) {
  var person = _ref.person;
  var company = _ref.company;
  var companies = _ref.companies;
  var persons = _ref.persons;
  var missions = _ref.missions;
  var tagsField = _ref.tagsField;
  var dispatch = _ref.dispatch;

  var styles = {
    container: {
      marginTop: '3rem'
    }
  };

  var handleClick = function handleClick(e) {
    e.preventDefault();
    dispatch(_actionsRoutes.routeActions.push(_routes2['default'].company.view, { companyId: company.get('_id') }));
  };

  // const handleClickTag = (tag) => {
  //   navActions.push(sitemap.person.list, {filter: `#${tag} `});
  // }

  var phones = function phones() {
    return _lodash2['default'].map(person.get('phones') && person.get('phones').toJS() || [], function (p) {
      return _react2['default'].createElement(
        'div',
        { key: p.label + p.number, className: 'col-md-4' },
        _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'Phone: ' + p.label, value: p.number })
      );
    });
  };

  var birthdate = function birthdate() {
    var date = person.get('birthdate') ? (0, _moment2['default'])(person.get('birthdate')).format('DD/MM/YY') : "";
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-2' },
      _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'Birth Date', value: date })
    );
  };

  var companyElement = function companyElement() {
    if (!company) return _react2['default'].createElement('div', null);
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_componentsWidgets.TextLabel, {
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
      _react2['default'].createElement(_componentsWidgets.MarkdownText, { label: 'Job Description', value: person.get('jobDescription') })
    );
  };

  var skills = function skills() {
    if (!person.get('skills') || !person.get('skills').size) return _react2['default'].createElement('div', null);
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_componentsWidgets.Labels, { label: 'Skills', value: person.get('skills') })
    );
  };

  var editTags = function editTags() {
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_tags2['default'], { field: tagsField })
    );
  };

  var roles = function roles() {
    if (!person.get('roles') || !person.get('roles').size) return _react2['default'].createElement('div', null);
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_componentsWidgets.Labels, { label: 'Roles', value: person.get('roles') })
    );
  };

  var type = function type() {
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-3' },
      _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'Type', value: person.get('type') })
    );
  };

  var jobType = function jobType() {
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-3' },
      _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'Job Type', value: person.get('jobType') })
    );
  };

  var email = function email() {
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-6' },
      _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'Email', value: person.get('email') })
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
        _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'Prefix', value: person.get('prefix') })
      ),
      _react2['default'].createElement(
        'div',
        { className: 'col-md-5' },
        _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'First Name', value: person.get('firstName') })
      ),
      _react2['default'].createElement(
        'div',
        { className: 'col-md-6' },
        _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'Last Name', value: person.get('lastName') })
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

Card.PropTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  person: _react.PropTypes.object.isRequired,
  company: _react.PropTypes.object.isRequired,
  companies: _react.PropTypes.object.isRequired,
  persons: _react.PropTypes.object.isRequired,
  missions: _react.PropTypes.object.isRequired,
  tags: _react.PropTypes.object.isRequired
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
        _componentsMissionWidgets.Preview,
        {
          mission: mission,
          manager: persons.get(mission.get('managerId')),
          workers: workers,
          company: company },
        _react2['default'].createElement(_componentsMissionWidgets.Edit, { mission: mission }),
        _react2['default'].createElement(_componentsMissionWidgets.Closed, { mission: mission })
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

Missions.PropTypes = {
  label: _react.PropTypes.string,
  missions: _react.PropTypes.object.isRequired,
  companies: _react.PropTypes.object.isRequired,
  persons: _react.PropTypes.object.isRequired
};

exports['default'] = (0, _reactRedux.connect)(_selectorsPersons.viewPersonSelector)(ViewPerson);
module.exports = exports['default'];
//# sourceMappingURL=view.js.map
