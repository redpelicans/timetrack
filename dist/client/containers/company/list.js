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

var _selectorsCompanies = require('../../selectors/companies');

var _actionsCompanies = require('../../actions/companies');

var _componentsLayout = require('../../components/layout');

var _componentsWidgets = require('../../components/widgets');

var _componentsCompanyWidgets = require('../../components/company/widgets');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var sortMenu = [{ key: 'name', label: 'Sort Alphabeticaly' }, { key: 'billable', label: 'Sort by billable amount' }, { key: 'billed', label: 'Sort by billed amount' }, { key: 'createdAt', label: 'Sort by creation date' }, { key: 'updatedAt', label: 'Sort by updated date' }];

var CompanyList = (function (_Component) {
  _inherits(CompanyList, _Component);

  function CompanyList() {
    var _this = this;

    _classCallCheck(this, CompanyList);

    _get(Object.getPrototypeOf(CompanyList.prototype), 'constructor', this).apply(this, arguments);

    this.handleRefresh = function () {
      _this.props.dispatch(_actionsCompanies.companiesActions.load({ forceReload: true }));
    };

    this.handlePreferred = function () {
      _this.props.dispatch(_actionsCompanies.companiesActions.togglePreferredFilter());
    };

    this.handleTogglePreferred = function (company) {
      _this.props.dispatch(_actionsCompanies.companiesActions.togglePreferred(company));
    };

    this.handleSort = function (mode) {
      _this.props.dispatch(_actionsCompanies.companiesActions.sort(mode));
    };

    this.handleSearchFilter = function (filter) {
      _this.props.dispatch(_actionsCompanies.companiesActions.filter(filter));
    };

    this.handleResetFilter = function (filter) {
      _this.props.dispatch(_actionsCompanies.companiesActions.filter(''));
    };
  }

  _createClass(CompanyList, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.dispatch(_actionsCompanies.companiesActions.load());
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var companies = _props.companies;
      var filter = _props.filter;
      var filterPreferred = _props.filterPreferred;
      var sortCond = _props.sortCond;
      var isLoading = _props.isLoading;

      return _react2['default'].createElement(
        _componentsLayout.Content,
        null,
        _react2['default'].createElement(
          _componentsWidgets.Header,
          null,
          _react2['default'].createElement(
            _componentsWidgets.HeaderLeft,
            null,
            _react2['default'].createElement(_componentsWidgets.TitleIcon, { isLoading: isLoading, icon: _routes2['default'].company.list.iconName }),
            _react2['default'].createElement(_componentsWidgets.Title, { title: 'Companies' })
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
        _react2['default'].createElement(List, { companies: companies }),
        _react2['default'].createElement(_componentsCompanyWidgets.AddButton, { title: 'Add a company' })
      );
    }
  }]);

  return CompanyList;
})(_react.Component);

CompanyList.propTypes = {
  companies: _react.PropTypes.object.isRequired,
  filter: _react.PropTypes.string,
  filterPreferred: _react.PropTypes.bool,
  sortCond: _react.PropTypes.object.isRequired,
  isLoading: _react.PropTypes.bool,
  dispatch: _react.PropTypes.func.isRequired
};

var List = function List(_ref) {
  var companies = _ref.companies;

  if (!companies) return false;

  var styles = {
    container: {
      marginTop: '50px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    item: {
      height: '80px'
    }
  };

  var data = companies.map(function (company) {
    return _react2['default'].createElement(
      'div',
      { key: company.get('_id'), className: 'col-md-6 tm list-item', style: styles.item },
      _react2['default'].createElement(_componentsCompanyWidgets.Preview, { company: company })
    );
  });

  return _react2['default'].createElement(
    'div',
    { className: 'row', style: styles.container },
    data
  );
};

List.propTypes = {
  companies: _react.PropTypes.object.isRequired
};

exports['default'] = (0, _reactRedux.connect)(_selectorsCompanies.visibleCompaniesSelector)(CompanyList);
module.exports = exports['default'];
//# sourceMappingURL=list.js.map
