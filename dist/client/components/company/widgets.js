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

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _componentsAuthmanager = require('../../components/authmanager');

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var _widgets = require('../widgets');

var _actionsRoutes = require('../../actions/routes');

var _actionsCompanies = require('../../actions/companies');

var Edit = (0, _componentsAuthmanager.authable)(function (_ref, _ref2) {
  var company = _ref.company;
  var authManager = _ref2.authManager;
  var dispatch = _ref2.dispatch;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    dispatch((0, _actionsRoutes.pushRoute)(_routes2['default'].company.edit, { companyId: company.get('_id') }));
  };

  if (authManager.company.isAuthorized('edit')) {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: 'iconButton fa fa-pencil m-r-1' })
    );
  } else {
    return _react2['default'].createElement('i', { className: 'iconButton disable fa fa-pencil m-r-1' });
  }
});

exports.Edit = Edit;
Edit.propTypes = {
  company: _react.PropTypes.object.isRequired
};

var Preferred = (0, _componentsAuthmanager.authable)(function (_ref3, _ref4) {
  var company = _ref3.company;
  var active = _ref3.active;
  var authManager = _ref4.authManager;
  var dispatch = _ref4.dispatch;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    dispatch(_actionsCompanies.companiesActions.togglePreferred(company.toJS()));
  };

  var classnames = (0, _classnames2['default'])("iconButton star fa fa-star-o m-r-1", {
    preferred: company.get('preferred')
  });

  if (active && authManager.company.isAuthorized('togglePreferred')) {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: classnames })
    );
  } else {
    return _react2['default'].createElement('i', { className: classnames });
  }
});

exports.Preferred = Preferred;
Preferred.propTypes = {
  company: _react.PropTypes.object.isRequired,
  active: _react.PropTypes.bool
};

var Delete = (0, _componentsAuthmanager.authable)(function (_ref5, _ref6) {
  var company = _ref5.company;
  var postAction = _ref5.postAction;
  var authManager = _ref6.authManager;
  var dispatch = _ref6.dispatch;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    var answer = confirm('Are you sure to delete the company "' + company.get('name') + '"');
    if (answer) {
      dispatch(_actionsCompanies.companiesActions['delete'](company.toJS()));
      if (postAction) postAction();
    }
  };

  if (authManager.company.isAuthorized('delete', { company: company })) {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: 'iconButton fa fa-trash m-r-1' })
    );
  } else {
    return _react2['default'].createElement('i', { className: 'iconButton disable fa fa-trash m-r-1' });
  }
});

exports.Delete = Delete;
Delete.propTypes = {
  company: _react.PropTypes.object.isRequired,
  postAction: _react.PropTypes.func
};

var AddButton = (function (_Component) {
  _inherits(AddButton, _Component);

  function AddButton() {
    var _this = this;

    _classCallCheck(this, _AddButton);

    _get(Object.getPrototypeOf(_AddButton.prototype), 'constructor', this).apply(this, arguments);

    this.handleClick = function () {
      $('#addObject').tooltip('hide');
      _this.context.dispatch((0, _actionsRoutes.pushRoute)(_routes2['default'].company['new']));
    };
  }

  _createClass(AddButton, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      $('#addObject').tooltip({ animation: true });
    }
  }, {
    key: 'render',
    value: function render() {
      var style = {
        position: 'fixed',
        display: 'block',
        right: 0,
        bottom: 0,
        marginRight: '30px',
        marginBottom: '30px',
        zIndex: '900'
      };

      var title = this.props.title;

      if (!this.context.authManager.company.isAuthorized('add')) {
        return _react2['default'].createElement('div', null);
      } else {
        return _react2['default'].createElement(
          'button',
          { id: 'addObject', type: 'button', className: 'btn-primary btn', 'data-toggle': 'tooltip', 'data-placement': 'left', title: title, style: style, onClick: this.handleClick },
          _react2['default'].createElement('i', { className: 'fa fa-plus' })
        );
      }
    }
  }]);

  var _AddButton = AddButton;
  AddButton = (0, _componentsAuthmanager.authable)(AddButton) || AddButton;
  return AddButton;
})(_react.Component);

exports.AddButton = AddButton;

AddButton.propTypes = {
  title: _react.PropTypes.string
};

var Preview = (function (_Component2) {
  _inherits(Preview, _Component2);

  function Preview() {
    var _this2 = this;

    _classCallCheck(this, _Preview);

    _get(Object.getPrototypeOf(_Preview.prototype), 'constructor', this).apply(this, arguments);

    this.state = { showActions: false };

    this.handleView = function (e) {
      e.preventDefault();
      _this2.context.dispatch((0, _actionsRoutes.pushRoute)(_routes2['default'].company.view, { companyId: _this2.props.company.get('_id') }));
    };

    this.handleMouseEnter = function (e) {
      _this2.setState({ showActions: true });
    };

    this.handleMouseLeave = function (e) {
      _this2.setState({ showActions: false });
    };
  }

  _createClass(Preview, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.company !== nextProps.company || this.state.showActions !== nextState.showActions;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      function amount(value) {
        if (!value) return;
        return Math.round(value / 1000) + ' k€';
      }

      function billAmount(company, type) {
        var name = { billed: 'Billed', billable: 'Billable' };
        if (company[type]) {
          return _react2['default'].createElement(
            'div',
            { style: styles[type] },
            _react2['default'].createElement(
              'span',
              null,
              name[type],
              ': ',
              amount(company[type] || 0)
            )
          );
        } else {
          return _react2['default'].createElement('div', { style: styles[type] });
        }
      }

      function billAmounts(company) {
        if (company.billed || company.billable) {
          return _react2['default'].createElement(
            'span',
            { className: 'label label-default' },
            [amount(company.billed), amount(company.billable)].join(' / ')
          );
        }
      }

      var styles = {
        container: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%'
        },
        containerLeft: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          padding: '5px'
        },
        containerRight: {
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',
          padding: '5px'
        },
        isnew: {
          position: 'absolute',
          bottom: '0',
          right: '0.1rem'
        },
        tags: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        },
        label: {
          color: '#cfd2da',
          padding: '.3rem'
        },
        preferred: {
          position: 'absolute',
          bottom: '3px',
          left: '3rem'
        }
      };

      var company = this.props.company;
      var avatar = _react2['default'].createElement(_widgets.AvatarView, { obj: company });

      var isNew = function isNew() {
        if (company.get('isNew')) return _react2['default'].createElement(_widgets.NewLabel, null);
        if (company.get('isUpdated')) return _react2['default'].createElement(_widgets.UpdatedLabel, null);
        return _react2['default'].createElement('div', null);
      };

      var tags = function tags() {
        var onClick = function onClick(tag, e) {
          e.preventDefault();
          var filter = '#' + tag + ' ';
          _this3.context.dispatch(_actionsCompanies.companiesActions.filter(filter));
          _this3.context.dispatch((0, _actionsRoutes.pushRoute)(_routes2['default'].company.list, { filter: filter }));
        };

        if (!company.get('tags') || !company.get('tags').size) return _react2['default'].createElement('div', null);

        return _.map(company.get('tags').toJS(), function (v) {
          return _react2['default'].createElement(
            'span',
            { key: v, style: styles.label, className: 'label label-primary m-r-1' },
            _react2['default'].createElement(
              'a',
              { href: '#', onClick: onClick.bind(null, v) },
              v
            )
          );
        });
      };

      var avatarView = function avatarView() {
        if (_this3.context.authManager.company.isAuthorized('view')) return _react2['default'].createElement(
          'a',
          { href: '#', onClick: _this3.handleView },
          avatar
        );else return { avatar: avatar };
      };
      var companyNameView = function companyNameView() {
        if (_this3.context.authManager.company.isAuthorized('view')) return _react2['default'].createElement(
          'a',
          { href: '#', onClick: _this3.handleView },
          company.get('name')
        );else return _react2['default'].createElement(
          'span',
          null,
          company.get('name')
        );
      };

      var actions = function actions() {
        if (!_this3.state.showActions) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          { style: styles.containerRight, href: '#' },
          _react2['default'].createElement(Edit, { company: company }),
          _react2['default'].createElement(Delete, { company: company })
        );
      };

      return _react2['default'].createElement(
        'div',
        { style: styles.container, onMouseOver: this.handleMouseEnter, onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave },
        _react2['default'].createElement(
          'div',
          { style: styles.containerLeft },
          _react2['default'].createElement(
            'div',
            { className: 'p-r-1' },
            avatarView()
          ),
          _react2['default'].createElement(
            'div',
            { style: styles.preferred },
            _react2['default'].createElement(Preferred, { company: company, active: true })
          ),
          _react2['default'].createElement(
            'div',
            { style: styles.isnew },
            isNew()
          ),
          _react2['default'].createElement(
            'div',
            { className: 'p-r-1' },
            companyNameView()
          ),
          _react2['default'].createElement(
            'div',
            { className: 'p-r-1' },
            billAmounts(company)
          ),
          _react2['default'].createElement(
            'div',
            { className: 'p-r-1' },
            tags()
          )
        ),
        actions()
      );
    }
  }]);

  var _Preview = Preview;
  Preview = (0, _componentsAuthmanager.authable)(Preview) || Preview;
  return Preview;
})(_react.Component);

exports.Preview = Preview;

Preview.propTypes = {
  company: _react.PropTypes.object.isRequired
};
//# sourceMappingURL=widgets.js.map
