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

var _layout = require('../layout');

var _widgets = require('../widgets');

var _personWidgets = require('../person/widgets');

var _companyWidgets = require('../company/widgets');

var _widgets2 = require('./widgets');

var _modelsMissions = require('../../models/missions');

var _modelsPersons = require('../../models/persons');

var _modelsCompanies = require('../../models/companies');

var _modelsNav = require('../../models/nav');

var _reactWidgetsLibDateTimePicker = require('react-widgets/lib/DateTimePicker');

var _reactWidgetsLibDateTimePicker2 = _interopRequireDefault(_reactWidgetsLibDateTimePicker);

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var _notes = require('../notes');

var _notes2 = _interopRequireDefault(_notes);

var ViewMissionApp = (function (_Component) {
  _inherits(ViewMissionApp, _Component);

  function ViewMissionApp() {
    _classCallCheck(this, ViewMissionApp);

    _get(Object.getPrototypeOf(ViewMissionApp.prototype), 'constructor', this).apply(this, arguments);

    this.state = {};

    this.goBack = function () {
      _modelsNav.navActions.goBack();
    };
  }

  _createClass(ViewMissionApp, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this = this;

      var missionId = this.props.location.state && this.props.location.state.missionId;
      if (!missionId) _modelsNav.navActions.replace(_routes2['default'].mission.list);

      this.unsubcribePersons = _modelsPersons.personsStore.listen(function (persons) {
        _this.setState({ persons: persons.data });
      });

      this.unsubcribeCompanies = _modelsCompanies.companiesStore.listen(function (companies) {
        _this.setState({ companies: companies.data });
      });

      this.unsubcribeMissions = _modelsMissions.missionsStore.listen(function (missions) {
        var mission = missions.data.get(missionId);
        if (mission) _this.setState({ mission: mission });else _modelsNav.navActions.replace(_routes2['default'].mission.list);
      });

      _modelsPersons.personsActions.load();
      _modelsCompanies.companiesActions.load();

      if (missionId) _modelsMissions.missionsActions.load({ ids: [missionId] });else _modelsNav.navActions.replace(_routes2['default'].mission.list);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubcribeCompanies();
      this.unsubcribePersons();
      this.unsubcribeMissions();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      //if( !this.state.mission || !this.state.persons || !this.state.companies) return false;
      if (!this.state.mission) return false;
      var mission = this.state.mission;
      var client = this.state.companies.get(mission.get("clientId"));
      var manager = this.state.persons.get(mission.get("managerId"));
      var workers = _lodash2['default'].map(mission.get('workerIds').toJS(), function (id) {
        return _this2.state.persons.get(id);
      });

      return _react2['default'].createElement(
        _layout.Content,
        null,
        _react2['default'].createElement(
          _widgets.Header,
          { obj: mission },
          _react2['default'].createElement(
            _widgets.HeaderLeft,
            null,
            _react2['default'].createElement(_widgets.GoBack, { goBack: this.goBack }),
            _react2['default'].createElement(_widgets.AvatarView, { obj: client }),
            _react2['default'].createElement(_widgets.Title, { title: mission.get('name') })
          ),
          _react2['default'].createElement(
            _widgets.HeaderRight,
            null,
            _react2['default'].createElement(_widgets2.Edit, { mission: mission }),
            _react2['default'].createElement(_widgets2.OpenClose, { mission: mission }),
            _react2['default'].createElement(_widgets2.Delete, { mission: mission, postAction: this.goBack })
          )
        ),
        _react2['default'].createElement(Card, {
          mission: this.state.mission,
          client: client,
          manager: manager,
          workers: workers })
      );
    }
  }]);

  return ViewMissionApp;
})(_react.Component);

exports['default'] = ViewMissionApp;

var Card = function Card(_ref) {
  var mission = _ref.mission;
  var client = _ref.client;
  var manager = _ref.manager;
  var workers = _ref.workers;

  var styles = {
    container: {
      marginTop: '3rem'
    }
  };

  return _react2['default'].createElement(
    'div',
    { style: styles.container, className: 'row' },
    _react2['default'].createElement('div', { className: 'col-md-2 ' }),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-3 ' },
      _react2['default'].createElement(Date, { label: 'Start Date', date: mission.get("startDate") })
    ),
    _react2['default'].createElement('div', { className: 'col-md-2 ' }),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-3 ' },
      _react2['default'].createElement(Date, { label: 'End Date', date: mission.get("endDate") })
    ),
    _react2['default'].createElement('div', { className: 'col-md-2 ' }),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-6 ' },
      _react2['default'].createElement(Client, { label: 'Client', client: client })
    ),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-6 ' },
      _react2['default'].createElement(Manager, { label: 'Manager', manager: manager })
    ),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(Workers, {
        label: 'Workers',
        workers: workers,
        mission: mission })
    ),
    _react2['default'].createElement(
      'div',
      { className: 'col-md-12' },
      _react2['default'].createElement(_notes2['default'], { entity: mission })
    )
  );
};

var Date = function Date(_ref2) {
  var label = _ref2.label;
  var date = _ref2.date;

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
    _react2['default'].createElement(_reactWidgetsLibDateTimePicker2['default'], {
      defaultValue: date,
      time: false,
      readOnly: true
    })
  );
};

var Client = function Client(_ref3) {
  var label = _ref3.label;
  var client = _ref3.client;

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

  if (!client) return _react2['default'].createElement('div', null);
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
      _react2['default'].createElement(
        'div',
        { className: 'col-md-12 tm list-item', style: styles.item },
        _react2['default'].createElement(
          _companyWidgets.Preview,
          { company: client },
          _react2['default'].createElement(_companyWidgets.Edit, { person: client })
        )
      )
    )
  );
};

var Manager = function Manager(_ref4) {
  var label = _ref4.label;
  var manager = _ref4.manager;

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

  if (!manager) return _react2['default'].createElement('div', null);
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
      _react2['default'].createElement(
        'div',
        { className: 'col-md-12 tm list-item', style: styles.item },
        _react2['default'].createElement(
          _personWidgets.Preview,
          { person: manager },
          _react2['default'].createElement(_personWidgets.Edit, { person: manager })
        )
      )
    )
  );
};

var Workers = function Workers(_ref5) {
  var label = _ref5.label;
  var workers = _ref5.workers;
  var mission = _ref5.mission;

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

  var className = workers.length > 1 ? "col-md-6 tm list-item" : "col-md-12 tm list-item";
  var data = _lodash2['default'].chain(workers).sortBy(function (person) {
    return person.get('name');
  }).map(function (person) {
    return _react2['default'].createElement(
      'div',
      { key: person.get('_id'), className: className, style: styles.item },
      _react2['default'].createElement(
        _personWidgets.Preview,
        { person: person },
        _react2['default'].createElement(_personWidgets.Edit, { person: person })
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
module.exports = exports['default'];
//# sourceMappingURL=view.js.map
