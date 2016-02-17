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

var _layout = require('../layout');

var _widgets = require('../widgets');

var _widgets2 = require('./widgets');

var _modelsPersons = require('../../models/persons');

var _modelsPersonsApp = require('../../models/persons-app');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var PersonListApp = (function (_Component) {
  _inherits(PersonListApp, _Component);

  function PersonListApp() {
    var _this = this;

    _classCallCheck(this, PersonListApp);

    _get(Object.getPrototypeOf(PersonListApp.prototype), 'constructor', this).apply(this, arguments);

    this.state = {};

    this.handleRefresh = function () {
      _modelsPersonsApp.personsAppActions.load({ forceReload: true });
    };

    this.handlePreferred = function () {
      _modelsPersonsApp.personsAppActions.filterPreferred(!_this.state.persons.filterPreferred);
    };

    this.handleSort = function (mode) {
      _modelsPersonsApp.personsAppActions.sort(mode);
    };

    this.handleSearchFilter = function (filter) {
      _modelsPersonsApp.personsAppActions.filter(filter);
    };

    this.handleResetFilter = function (filter) {
      _modelsPersonsApp.personsAppActions.filter("");
    };
  }

  _createClass(PersonListApp, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var filter = this.props.location.state && this.props.location.state.filter;
      if (filter) _modelsPersonsApp.personsAppActions.filter(filter);

      this.unsubscribe = _modelsPersonsApp.personsAppStore.listen(function (state) {
        _this2.setState({ persons: state });
      });

      _modelsPersonsApp.personsAppActions.load();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unsubscribe();
    }
  }, {
    key: 'render',

    // shouldComponentUpdate(nextProps, nextState){
    //   return this.state.people !== nextState.people ||
    //     this.state.searchFilter != nextState.searchFilter || 
    //     this.state.sortCond != nextState.sortCond || 
    //     this.state.starFilter != nextState.starFilter;
    // }

    value: function render() {
      if (!this.state.persons) return false;
      var persons = this.state.persons.data;
      var companies = this.state.persons.companies;
      return _react2['default'].createElement(
        _layout.Content,
        null,
        _react2['default'].createElement(
          _widgets.Header,
          null,
          _react2['default'].createElement(
            _widgets.HeaderLeft,
            null,
            _react2['default'].createElement(_widgets.TitleIcon, { isLoading: this.state.persons.isLoading, icon: _routes2['default'].person.list.iconName }),
            _react2['default'].createElement(_widgets.Title, { title: 'People' })
          ),
          _react2['default'].createElement(
            _widgets.HeaderRight,
            null,
            _react2['default'].createElement(_widgets.Filter, { filter: this.state.persons.filter, onReset: this.handleResetFilter, onChange: this.handleSearchFilter }),
            _react2['default'].createElement(_widgets.Sort, { sortMenu: _modelsPersonsApp.sortMenu, sortCond: this.state.persons.sort, onClick: this.handleSort }),
            _react2['default'].createElement(_widgets.FilterPreferred, { preferred: this.state.persons.filterPreferred, onClick: this.handlePreferred }),
            _react2['default'].createElement(_widgets.Refresh, { onClick: this.handleRefresh })
          )
        ),
        _react2['default'].createElement(List, {
          persons: persons,
          companies: companies }),
        _react2['default'].createElement(_widgets2.AddButton, { title: 'Add a Contact' })
      );
    }
  }]);

  return PersonListApp;
})(_react.Component);

exports['default'] = PersonListApp;

var List = (function (_Component2) {
  _inherits(List, _Component2);

  function List() {
    _classCallCheck(this, List);

    _get(Object.getPrototypeOf(List.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(List, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.persons !== nextProps.persons || this.props.companies !== nextProps.companies;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (!this.props.persons.size || !this.props.companies.size) return false;

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

      var data = this.props.persons.map(function (person) {
        return _react2['default'].createElement(
          'div',
          { key: person.get('_id'), className: 'col-md-6 tm list-item', style: styles.item },
          _react2['default'].createElement(
            _widgets2.Preview,
            {
              person: person,
              company: _this3.props.companies.get(person.get('companyId')) },
            _react2['default'].createElement(_widgets2.Edit, { person: person }),
            _react2['default'].createElement(_widgets2.Delete, { person: person })
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
