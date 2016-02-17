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

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _layout = require('../layout');

var _modelsMissions = require('../../models/missions');

var _modelsMissionsApp = require('../../models/missions-app');

var _modelsPersons = require('../../models/persons');

var _modelsCompanies = require('../../models/companies');

var _widgets = require('./widgets');

var _widgets2 = require('../widgets');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var ListMissionApp = (function (_Component) {
  _inherits(ListMissionApp, _Component);

  function ListMissionApp() {
    _classCallCheck(this, ListMissionApp);

    _get(Object.getPrototypeOf(ListMissionApp.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      persons: _immutable2['default'].Map(),
      companies: _immutable2['default'].Map()
    };

    this.handleRefresh = function () {
      _modelsMissionsApp.missionsAppActions.load({ forceReload: true });
    };

    this.handleSort = function (mode) {
      _modelsMissionsApp.missionsAppActions.sort(mode);
    };

    this.handleSearchFilter = function (filter) {
      _modelsMissionsApp.missionsAppActions.filter(filter);
    };

    this.handleResetFilter = function (filter) {
      _modelsMissionsApp.missionsAppActions.filter("");
    };
  }

  _createClass(ListMissionApp, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this = this;

      this.unsubscribeMissions = _modelsMissionsApp.missionsAppStore.listen(function (state) {
        _this.setState({ missions: state });
      });
      _modelsMissionsApp.missionsAppActions.load();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribeMissions();
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state.missions) return false;
      var companies = this.state.missions.companies;
      var persons = this.state.missions.persons;
      var missions = this.state.missions.data;
      return _react2['default'].createElement(
        _layout.Content,
        null,
        _react2['default'].createElement(
          _widgets2.Header,
          null,
          _react2['default'].createElement(
            _widgets2.HeaderLeft,
            null,
            _react2['default'].createElement(_widgets2.TitleIcon, { isLoading: this.state.missions.isLoading, icon: _routes2['default'].mission.list.iconName }),
            _react2['default'].createElement(_widgets2.Title, { title: 'Missions' })
          ),
          _react2['default'].createElement(
            _widgets2.HeaderRight,
            null,
            _react2['default'].createElement(_widgets2.Filter, { filter: this.state.missions.filter, onReset: this.handleResetFilter, onChange: this.handleSearchFilter }),
            _react2['default'].createElement(_widgets2.Sort, { sortMenu: _modelsMissionsApp.sortMenu, sortCond: this.state.missions.sort, onClick: this.handleSort }),
            _react2['default'].createElement(_widgets2.Refresh, { onClick: this.handleRefresh })
          )
        ),
        _react2['default'].createElement(List, {
          missions: missions,
          persons: persons,
          companies: companies }),
        _react2['default'].createElement(_widgets.AddButton, { title: 'Add a Mission' })
      );
    }
  }]);

  return ListMissionApp;
})(_react.Component);

exports['default'] = ListMissionApp;

var List = (function (_Component2) {
  _inherits(List, _Component2);

  function List() {
    _classCallCheck(this, List);

    _get(Object.getPrototypeOf(List.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(List, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.missions !== nextProps.missions || this.props.companies !== nextProps.companies || this.props.persons !== nextProps.persons;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.props.missions.size) return false;

      var styles = {
        container: {
          marginTop: '50px',
          //marginBottom: '50px',
          marginLeft: 'auto',
          marginRight: 'auto'
        },
        item: {
          height: '80px'
        }
      };

      var data = this.props.missions.map(function (mission) {
        var workers = _this2.props.persons.filter(function (person) {
          return mission.get('workerIds').indexOf(person.get('_id')) !== -1;
        });
        return _react2['default'].createElement(
          'div',
          { key: mission.get('_id'), className: 'col-md-6 tm list-item', style: styles.item },
          _react2['default'].createElement(
            _widgets.Preview,
            {
              mission: mission,
              workers: workers,
              company: _this2.props.companies.get(mission.get('clientId')),
              manager: _this2.props.persons.get(mission.get('managerId')) },
            _react2['default'].createElement(_widgets.Closed, { mission: mission }),
            _react2['default'].createElement(_widgets.Edit, { mission: mission }),
            _react2['default'].createElement(_widgets.Delete, { mission: mission })
          )
        );
      });

      return _react2['default'].createElement(
        'div',
        { className: 'row', style: styles.container },
        data
      );
    }
  }]);

  return List;
})(_react.Component);

module.exports = exports['default'];
//# sourceMappingURL=list.js.map
