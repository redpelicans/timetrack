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

var _reactRedux = require('react-redux');

var _componentsLayout = require('../../components/layout');

var _componentsWidgets = require('../../components/widgets');

var _componentsPersonWidgets = require('../../components/person/widgets');

var _actionsPersons = require('../../actions/persons');

var _actionsCompanies = require('../../actions/companies');

var _selectorsPersonsJs = require('../../selectors/persons.js');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var sortMenu = [{ key: 'name', label: 'Sort Alphabeticaly' }, { key: 'createdAt', label: 'Sort by creation date' }, { key: 'updatedAt', label: 'Sort by updated date' }];

var PersonList = (function (_Component) {
  _inherits(PersonList, _Component);

  function PersonList() {
    var _this = this;

    _classCallCheck(this, PersonList);

    _get(Object.getPrototypeOf(PersonList.prototype), 'constructor', this).apply(this, arguments);

    this.handleRefresh = function () {
      _this.props.dispatch(_actionsPersons.personsActions.load({ forceReload: true }));
    };

    this.handlePreferred = function () {
      var _props = _this.props;
      var filterPreferred = _props.filterPreferred;
      var dispatch = _props.dispatch;
      var persons = _props.persons;

      dispatch(_actionsPersons.personsActions.togglePreferredFilter());
    };

    this.handleSort = function (mode) {
      _this.props.dispatch(_actionsPersons.personsActions.sort(mode));
    };

    this.handleSearchFilter = function (filter) {
      _this.props.dispatch(_actionsPersons.personsActions.filter(filter));
    };

    this.handleResetFilter = function (filter) {
      _this.props.dispatch(_actionsPersons.personsActions.filter(""));
    };
  }

  _createClass(PersonList, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.dispatch(_actionsPersons.personsActions.load());
      this.props.dispatch(_actionsCompanies.companiesActions.load());
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props;
      var persons = _props2.persons;
      var companies = _props2.companies;
      var filter = _props2.filter;
      var filterPreferred = _props2.filterPreferred;
      var sortCond = _props2.sortCond;
      var isLoading = _props2.isLoading;

      return _react2['default'].createElement(
        _componentsLayout.Content,
        null,
        _react2['default'].createElement(
          _componentsWidgets.Header,
          null,
          _react2['default'].createElement(
            _componentsWidgets.HeaderLeft,
            null,
            _react2['default'].createElement(_componentsWidgets.TitleIcon, { isLoading: isLoading, icon: _routes2['default'].person.list.iconName }),
            _react2['default'].createElement(_componentsWidgets.Title, { title: 'People' })
          ),
          _react2['default'].createElement(
            _componentsWidgets.HeaderRight,
            null,
            _react2['default'].createElement(_componentsWidgets.Filter, { filter: filter, onReset: this.handleResetFilter, onChange: this.handleSearchFilter }),
            _react2['default'].createElement(_componentsWidgets.Sort, { sortMenu: sortMenu, sortCond: sortCond, onClick: this.handleSort }),
            _react2['default'].createElement(_componentsWidgets.FilterPreferred, { preferred: filterPreferred, onClick: this.handlePreferred }),
            _react2['default'].createElement(_componentsWidgets.Refresh, { onClick: this.handleRefresh })
          )
        ),
        _react2['default'].createElement(List, { persons: persons, companies: companies }),
        _react2['default'].createElement(_componentsPersonWidgets.AddButton, { title: 'Add a Contact' })
      );
    }
  }]);

  return PersonList;
})(_react.Component);

PersonList.propTypes = {
  persons: _react.PropTypes.object.isRequired,
  companies: _react.PropTypes.object.isRequired,
  filter: _react.PropTypes.string,
  filterPreferred: _react.PropTypes.bool,
  sortCond: _react.PropTypes.object.isRequired,
  isLoading: _react.PropTypes.bool,
  dispatch: _react.PropTypes.func.isRequired
};

var List = function List(_ref) {
  var persons = _ref.persons;
  var companies = _ref.companies;

  if (!persons || !companies) return false;

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

  var data = persons.map(function (person) {
    return _react2['default'].createElement(
      'div',
      { key: person.get('_id'), className: 'col-md-6 tm list-item', style: styles.item },
      _react2['default'].createElement(
        _componentsPersonWidgets.Preview,
        {
          person: person,
          company: companies.get(person.get('companyId')) },
        _react2['default'].createElement(_componentsPersonWidgets.Edit, { person: person }),
        _react2['default'].createElement(_componentsPersonWidgets.Delete, { person: person })
      )
    );
  });

  return _react2['default'].createElement(
    'div',
    { className: 'row', style: styles.container },
    data
  );
};

List.propTypes = {
  persons: _react.PropTypes.object.isRequired,
  companies: _react.PropTypes.object.isRequired
};

exports['default'] = (0, _reactRedux.connect)(_selectorsPersonsJs.visiblePersonsSelector)(PersonList);
module.exports = exports['default'];
//# sourceMappingURL=list.js.map
