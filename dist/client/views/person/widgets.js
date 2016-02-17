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

var _routes = require('../../routes');

var _routes2 = _interopRequireDefault(_routes);

var _modelsNav = require('../../models/nav');

var _modelsPersons = require('../../models/persons');

var _modelsPersonsApp = require('../../models/persons-app');

var _auths = require('../../auths');

var _auths2 = _interopRequireDefault(_auths);

var _widgets = require('../widgets');

var Edit = function Edit(_ref) {
  var person = _ref.person;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    _modelsNav.navActions.push(_routes2['default'].person.edit, { personId: person.get('_id') });
  };

  if (_auths2['default'].person.isAuthorized('edit')) {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: 'iconButton fa fa-pencil m-r-1' })
    );
  } else {
    return _react2['default'].createElement('i', { className: 'iconButton disable fa fa-pencil m-r-1' });
  }
};

exports.Edit = Edit;
var Delete = function Delete(_ref2) {
  var person = _ref2.person;
  var postAction = _ref2.postAction;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    var answer = confirm('Are you sure to delete the contact "' + person.get('name') + '"');
    if (answer) {
      _modelsPersons.personsActions['delete'](person.toJS());
      if (postAction) postAction();
    }
  };

  if (_auths2['default'].person.isAuthorized('delete')) {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: 'iconButton fa fa-trash m-r-1' })
    );
  } else {
    return _react2['default'].createElement('i', { className: 'iconButton disable fa fa-trash m-r-1' });
  }
};

exports.Delete = Delete;
var Preferred = function Preferred(_ref3) {
  var person = _ref3.person;
  var active = _ref3.active;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    _modelsPersons.personsActions.togglePreferred(person);
  };

  var classnames = (0, _classnames2['default'])("iconButton star fa fa-star-o m-r-1", {
    preferred: person.get('preferred')
  });

  if (active && _auths2['default'].person.isAuthorized('togglePreferred')) {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: classnames })
    );
  } else {
    return _react2['default'].createElement('i', { className: classnames });
  }
};

exports.Preferred = Preferred;

var AddButton = (function (_Component) {
  _inherits(AddButton, _Component);

  function AddButton() {
    _classCallCheck(this, AddButton);

    _get(Object.getPrototypeOf(AddButton.prototype), 'constructor', this).apply(this, arguments);

    this.handleClick = function () {
      $('#addObject').tooltip('hide');
      _modelsNav.navActions.push(_routes2['default'].person['new']);
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

      if (!_auths2['default'].person.isAuthorized('add')) {
        return _react2['default'].createElement('div', null);
      } else {
        return _react2['default'].createElement(
          'button',
          { id: 'addObject', type: 'button', className: 'btn-primary btn', 'data-toggle': 'tooltip', 'data-placement': 'left', title: this.props.title, style: style, onClick: this.handleClick },
          _react2['default'].createElement('i', { className: 'fa fa-plus' })
        );
      }
    }
  }]);

  return AddButton;
})(_react.Component);

exports.AddButton = AddButton;

var Preview = (function (_Component2) {
  _inherits(Preview, _Component2);

  function Preview() {
    var _this = this;

    _classCallCheck(this, Preview);

    _get(Object.getPrototypeOf(Preview.prototype), 'constructor', this).apply(this, arguments);

    this.state = { showActions: false };

    this.handleViewPerson = function (e) {
      e.preventDefault();
      _modelsNav.navActions.push(_routes2['default'].person.view, { personId: _this.props.person.get('_id') });
    };

    this.handleViewCompany = function (e) {
      e.preventDefault();
      _modelsNav.navActions.push(_routes2['default'].company.view, { companyId: _this.props.company.get('_id') });
    };

    this.handleMouseEnter = function (e) {
      _this.setState({ showActions: true });
    };

    this.handleMouseLeave = function (e) {
      _this.setState({ showActions: false });
    };
  }

  _createClass(Preview, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.person !== nextProps.person || this.props.company !== nextProps.company || this.state.showActions !== nextState.showActions;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      console.log("render Person");
      function phone(person) {
        if (!person.phones || !person.phones.length) return '';
        var _person$phones$0 = person.phones[0];
        var label = _person$phones$0.label;
        var phone = _person$phones$0.phone;

        return 'tel. ' + label + ': ' + phone;
      }

      var companyView = function companyView() {
        var company = _this2.props.company;
        if (!company) return '';
        return _react2['default'].createElement(
          'div',
          { style: styles.company, className: 'p-r-1' },
          ' ',
          _react2['default'].createElement(
            'a',
            { href: '#', onClick: _this2.handleViewCompany },
            company.get('name')
          ),
          ' '
        );
      };

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
        names: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        },
        name: {},
        company: {
          fontStyle: 'italic'
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

      var person = this.props.person;
      var avatar = _react2['default'].createElement(_widgets.AvatarView, { obj: person });
      var isNew = function isNew() {
        if (person.get('isNew')) return _react2['default'].createElement(_widgets.NewLabel, null);
        if (person.get('isUpdated')) return _react2['default'].createElement(_widgets.UpdatedLabel, null);
        return _react2['default'].createElement('div', null);
      };

      var tags = function tags() {
        var onClick = function onClick(tag, e) {
          e.preventDefault();
          var filter = '#' + tag + ' ';
          _modelsPersonsApp.personsAppActions.filter(filter);
          _modelsNav.navActions.push(_routes2['default'].person.list, { filter: filter });
        };

        if (!person.get('tags') || !person.get('tags').size) return _react2['default'].createElement('div', null);

        return _.map(person.get('tags').toJS(), function (v) {
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

      var personView = function personView() {
        if (_auths2['default'].person.isAuthorized('view')) {
          return _react2['default'].createElement(
            'a',
            { href: '#', onClick: _this2.handleViewPerson },
            person.get('name')
          );
        } else {
          return _react2['default'].createElement(
            'span',
            null,
            person.get('name')
          );
        }
      };

      var actions = function actions() {
        if (!_this2.state.showActions) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          { style: styles.containerRight, href: '#' },
          _this2.props.children
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
            _react2['default'].createElement(
              'a',
              { href: '#', onClick: this.handleViewPerson },
              avatar
            )
          ),
          _react2['default'].createElement(
            'div',
            { style: styles.isnew },
            isNew()
          ),
          _react2['default'].createElement(
            'div',
            { style: styles.preferred },
            _react2['default'].createElement(Preferred, { person: person, active: true })
          ),
          _react2['default'].createElement(
            'div',
            { style: styles.names },
            _react2['default'].createElement(
              'div',
              { style: styles.name, className: 'p-r-1' },
              personView()
            ),
            companyView()
          ),
          _react2['default'].createElement(
            'div',
            { className: 'p-r-1', style: styles.tags },
            tags()
          )
        ),
        actions()
      );
    }
  }]);

  return Preview;
})(_react.Component);

exports.Preview = Preview;
//# sourceMappingURL=widgets.js.map
