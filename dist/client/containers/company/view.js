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

var _actionsRoutes = require('../../actions/routes');

var _reactRedux = require('react-redux');

var _selectorsCompanies = require('../../selectors/companies');

var _componentsAuthmanager = require('../../components/authmanager');

var _actionsCompanies = require('../../actions/companies');

var _actionsPersons = require('../../actions/persons');

var _actionsMissions = require('../../actions/missions');

var _componentsWidgets = require('../../components/widgets');

var _componentsPersonWidgets = require('../../components/person/widgets');

var _containersTags = require('../../containers/tags');

var _containersTags2 = _interopRequireDefault(_containersTags);

var _containersNotes = require('../../containers/notes');

var _containersNotes2 = _interopRequireDefault(_containersNotes);

var _componentsMissionWidgets = require('../../components/mission/widgets');

var _componentsCompanyWidgets = require('../../components/company/widgets');

var _componentsLayout = require('../../components/layout');

var _formsTags = require('../../forms/tags');

var _formsTags2 = _interopRequireDefault(_formsTags);

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var CompanyView = (function (_Component) {
  _inherits(CompanyView, _Component);

  function CompanyView() {
    var _this = this;

    _classCallCheck(this, CompanyView);

    _get(Object.getPrototypeOf(CompanyView.prototype), 'constructor', this).apply(this, arguments);

    this.state = {};

    this.goBack = function () {
      _this.props.dispatch(_actionsRoutes.routeActions.goBack());
    };
  }

  _createClass(CompanyView, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props;
      var dispatch = _props.dispatch;
      var company = _props.company;

      if (!company) dispatch(_actionsRoutes.routeActions.replace(_routes2['default'].company.list));

      this.tagsField = (0, _formsTags2['default'])({ tags: company.get('tags') }).field('tags');
      this.unsubscribeTagsField = this.tagsField.onValue(function (state) {
        if (state.hasBeenModified) dispatch(_actionsCompanies.companiesActions.updateTags(company.toJS(), state.value));
      });

      dispatch(_actionsPersons.personsActions.load());
      dispatch(_actionsMissions.missionsActions.load());
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeTagsField) this.unsubscribeTagsField();
    }
  }, {
    key: 'render',

    // handleClickTag = (tag) => {
    //   this.props.dispatch(routeActions.push(sitemap.company.list, {filter: `#${tag} `}));
    // }

    value: function render() {
      var _props2 = this.props;
      var company = _props2.company;
      var persons = _props2.persons;
      var missions = _props2.missions;
      var isLoading = _props2.isLoading;

      if (!company || !persons) return false;
      return _react2['default'].createElement(
        _componentsLayout.Content,
        null,
        _react2['default'].createElement(
          _componentsWidgets.Header,
          { obj: company },
          _react2['default'].createElement(
            _componentsWidgets.HeaderLeft,
            null,
            _react2['default'].createElement(_componentsWidgets.GoBack, { goBack: this.goBack, isLoading: isLoading }),
            _react2['default'].createElement(_componentsWidgets.AvatarView, { obj: company }),
            _react2['default'].createElement(_componentsWidgets.Title, { title: company.get('name') }),
            _react2['default'].createElement(_componentsCompanyWidgets.Preferred, { active: true, company: company })
          ),
          _react2['default'].createElement(
            _componentsWidgets.HeaderRight,
            null,
            _react2['default'].createElement(AddMission, { company: company }),
            _react2['default'].createElement(AddPerson, { company: company }),
            _react2['default'].createElement(_componentsCompanyWidgets.Edit, { company: company }),
            _react2['default'].createElement(_componentsCompanyWidgets.Delete, { company: company, postAction: this.goBack })
          )
        ),
        _react2['default'].createElement(Card, {
          company: company,
          missions: missions,
          tagsField: this.tagsField,
          persons: persons })
      );
    }
  }]);

  return CompanyView;
})(_react.Component);

CompanyView.propTypes = {
  company: _react.PropTypes.object,
  persons: _react.PropTypes.object,
  missions: _react.PropTypes.object,
  dispatch: _react.PropTypes.func.isRequired
};

var Card = function Card(_ref) {
  var company = _ref.company;
  var persons = _ref.persons;
  var missions = _ref.missions;
  var tagsField = _ref.tagsField;

  var styles = {
    container: {
      marginTop: '3rem'
    }
  };

  var editTags = function editTags() {
    return _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_containersTags2['default'], { field: tagsField })
    );
  };

  return _react2['default'].createElement(
    'div',
    { style: styles.container, className: 'row' },
    _react2['default'].createElement(
      'div',
      { className: 'col-md-4 ' },
      _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'Type', value: company.get('type') })
    ),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-8 ' },
      _react2['default'].createElement(_componentsWidgets.TextLabel, { url: company.get('website'), label: 'website', value: company.get('website') })
    ),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-5' },
      _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'Street', value: company.getIn(['address', 'street']) })
    ),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-2' },
      _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'Zip Code', value: company.getIn(['address', 'zipcode']) })
    ),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-2' },
      _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'City', value: company.getIn(['address', 'city']) })
    ),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-3' },
      _react2['default'].createElement(_componentsWidgets.TextLabel, { label: 'Country', value: company.getIn(['address', 'country']) })
    ),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(Persons, {
        label: 'Contacts',
        persons: persons,
        company: company })
    ),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(Missions, {
        label: 'Missions',
        persons: persons,
        company: company,
        missions: missions })
    ),
    editTags(),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_containersNotes2['default'], { entity: company })
    )
  );
};

Card.PropTypes = {
  company: _react.PropTypes.object.isRequired,
  persons: _react.PropTypes.object.isRequired,
  missions: _react.PropTypes.object.isRequired,
  tagsField: _react.PropTypes.object.isRequired
};

var Missions = function Missions(_ref2) {
  var label = _ref2.label;
  var missions = _ref2.missions;
  var company = _ref2.company;
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
    var workers = persons.filter(function (person) {
      return mission.get('workerIds').indexOf(person.get('_id')) !== -1;
    });
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

Missions.propTypes = {
  label: _react.PropTypes.string.isRequired,
  company: _react.PropTypes.object.isRequired,
  persons: _react.PropTypes.object.isRequired,
  missions: _react.PropTypes.object.isRequired
};

var Persons = function Persons(_ref3) {
  var label = _ref3.label;
  var company = _ref3.company;
  var persons = _ref3.persons;

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

  var ids = company.get('personIds').toJS();
  var data = _lodash2['default'].chain(ids).map(function (id) {
    return persons.get(id);
  }).compact().sortBy(function (person) {
    return person.get('name');
  }).map(function (person) {
    return _react2['default'].createElement(
      'div',
      { key: person.get('_id'), className: 'col-md-6 tm list-item', style: styles.item },
      _react2['default'].createElement(
        _componentsPersonWidgets.Preview,
        { person: person },
        _react2['default'].createElement(LeaveCompany, { company: company, person: person }),
        _react2['default'].createElement(_componentsPersonWidgets.Edit, { person: person }),
        _react2['default'].createElement(_componentsPersonWidgets.Delete, { person: person })
      )
    );
  }).value();

  if (!data.length) return _react2['default'].createElement('div', null);

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

Persons.propTypes = {
  label: _react.PropTypes.string.isRequired,
  company: _react.PropTypes.object.isRequired,
  persons: _react.PropTypes.object.isRequired
};

var LeaveCompany = (0, _componentsAuthmanager.authable)(function (_ref4, _ref5) {
  var company = _ref4.company;
  var person = _ref4.person;
  var authManager = _ref5.authManager;
  var dispatch = _ref5.dispatch;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    var answer = confirm('Can you confirm you want to fire "' + person.get('name') + '"');
    if (answer) {
      dispatch(_actionsCompanies.companiesActions.leave(company, person));
    }
  };

  if (authManager.company.isAuthorized('leave')) {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: 'iconButton fa fa-sign-out m-r-1' })
    );
  } else {
    return _react2['default'].createElement('i', { className: 'iconButton disable fa fa-sign-out m-r-1' });
  }
});

exports.LeaveCompany = LeaveCompany;
LeaveCompany.propTypes = {
  company: _react.PropTypes.object.isRequired,
  person: _react.PropTypes.object.isRequired
};

var AddPerson = (0, _componentsAuthmanager.authable)(function (_ref6, _ref7) {
  var company = _ref6.company;
  var authManager = _ref7.authManager;
  var dispatch = _ref7.dispatch;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    dispatch(_actionsRoutes.routeActions.push(_routes2['default'].person['new'], { companyId: company.get('_id') }));
  };

  if (authManager.isAuthorized(_routes2['default'].person['new'])) {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: 'iconButton fa fa-user-plus m-r-1' })
    );
  } else {
    return _react2['default'].createElement('i', { className: 'iconButton disable fa fa-user-plus m-r-1' });
  }
});

exports.AddPerson = AddPerson;
AddPerson.propTypes = {
  company: _react.PropTypes.object.isRequired
};

var AddMission = (0, _componentsAuthmanager.authable)(function (_ref8, _ref9) {
  var company = _ref8.company;
  var authManager = _ref9.authManager;
  var dispatch = _ref9.dispatch;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    dispatch(_actionsRoutes.routeActions.push(_routes2['default'].mission['new'], { clientId: company.get('_id') }));
  };

  if (authManager.isAuthorized(_routes2['default'].mission['new'])) {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: 'iconButton fa fa-cart-plus m-r-1' })
    );
  } else {
    return _react2['default'].createElement('i', { className: 'iconButton disable fa fa-cart-plus m-r-1' });
  }
});

exports.AddMission = AddMission;
AddMission.propTypes = {
  company: _react.PropTypes.object.isRequired
};

exports['default'] = (0, _reactRedux.connect)(_selectorsCompanies.viewCompanySelector)(CompanyView);
//# sourceMappingURL=view.js.map
