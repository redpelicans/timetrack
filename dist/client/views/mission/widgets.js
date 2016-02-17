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

var _modelsMissions = require('../../models/missions');

var _modelsMissionsApp = require('../../models/missions-app');

var _auths = require('../../auths');

var _auths2 = _interopRequireDefault(_auths);

var _widgets = require('../widgets');

var Closed = function Closed(_ref) {
  var mission = _ref.mission;

  if (mission.get('isClosed')) return _react2['default'].createElement('i', { className: 'iconButton fa fa-lock m-r-1' });else return _react2['default'].createElement('div', null);
};

exports.Closed = Closed;
var Edit = function Edit(_ref2) {
  var mission = _ref2.mission;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    _modelsNav.navActions.push(_routes2['default'].mission.edit, { missionId: mission.get('_id') });
  };

  if (mission.get('isClosed')) return _react2['default'].createElement('div', null);

  if (_auths2['default'].mission.isAuthorized('edit', { mission: mission })) {
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
var Close = function Close(_ref3) {
  var mission = _ref3.mission;
  var postAction = _ref3.postAction;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    var answer = confirm('Are you sure to close the mission "' + mission.get('name') + '"');
    if (answer) {
      _modelsMissions.missionsActions.close(mission.toJS());
      if (postAction) postAction();
    }
  };

  if (_auths2['default'].mission.isAuthorized('close', { mission: mission })) {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: 'iconButton fa fa-lock m-r-1' })
    );
  } else {
    return _react2['default'].createElement('i', { className: 'iconButton disable fa fa-lock m-r-1' });
  }
};

exports.Close = Close;
var OpenClose = function OpenClose(_ref4) {
  var mission = _ref4.mission;
  var postAction = _ref4.postAction;

  return mission.get('isClosed') ? _react2['default'].createElement(Open, { mission: mission, postAction: postAction }) : _react2['default'].createElement(Close, { mission: mission, postAction: postAction });
};

exports.OpenClose = OpenClose;
var Open = function Open(_ref5) {
  var mission = _ref5.mission;
  var postAction = _ref5.postAction;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    var answer = confirm('Are you sure to re-open the mission "' + mission.get('name') + '"');
    if (answer) {
      _modelsMissions.missionsActions.open(mission.toJS());
      if (postAction) postAction();
    }
  };

  if (_auths2['default'].mission.isAuthorized('open', { mission: mission })) {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: 'iconButton fa fa-unlock m-r-1' })
    );
  } else {
    return _react2['default'].createElement('i', { className: 'iconButton disable fa fa-unlock m-r-1' });
  }
};

exports.Open = Open;
var Delete = function Delete(_ref6) {
  var mission = _ref6.mission;
  var postAction = _ref6.postAction;

  var handleChange = function handleChange(e) {
    e.preventDefault();
    var answer = confirm('Are you sure to delete the mission "' + mission.get('name') + '"');
    if (answer) {
      _modelsMissions.missionsActions['delete'](mission.toJS());
      if (postAction) postAction();
    }
  };

  if (mission.get('isClosed')) return _react2['default'].createElement('div', null);

  if (_auths2['default'].mission.isAuthorized('delete', { mission: mission })) {
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

var AddButton = (function (_Component) {
  _inherits(AddButton, _Component);

  function AddButton() {
    _classCallCheck(this, AddButton);

    _get(Object.getPrototypeOf(AddButton.prototype), 'constructor', this).apply(this, arguments);

    this.handleClick = function () {
      $('#addObject').tooltip('hide');
      _modelsNav.navActions.push(_routes2['default'].mission['new']);
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

      if (!_auths2['default'].mission.isAuthorized('add')) {
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

    this.handleViewMission = function (e) {
      e.preventDefault();
      _modelsNav.navActions.push(_routes2['default'].mission.view, { missionId: _this.props.mission.get('_id') });
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
      return this.props.mission !== nextProps.mission || this.props.manager !== nextProps.manager
      //|| this.props.workers !== nextProps.workers // TODO: find a way to avoid refresh each time
       || this.props.company !== nextProps.company || this.state.showActions !== nextState.showActions;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      console.log("render Mission");

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
        manager: {
          position: 'absolute',
          bottom: '3px',
          left: '3rem'
        },
        workers: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        },
        worker: {
          color: '#cfd2da',
          padding: '.3rem'
        }

      };

      var mission = this.props.mission;
      var company = this.props.company;
      var workers = this.props.workers;
      var avatar = _react2['default'].createElement(_widgets.AvatarView, { obj: company });

      var isNew = function isNew() {
        if (mission.get('isUpdated')) return _react2['default'].createElement(_widgets.UpdatedLabel, null);
        if (mission.get('isNew')) return _react2['default'].createElement(_widgets.NewLabel, null);
        return _react2['default'].createElement('div', null);
      };

      var missionView = function missionView() {
        if (_auths2['default'].mission.isAuthorized('view')) {
          return _react2['default'].createElement(
            'a',
            { href: '#', onClick: _this2.handleViewMission },
            mission.get('name')
          );
        } else {
          return _react2['default'].createElement(
            'span',
            null,
            mission.get('name')
          );
        }
      };

      var workersView = function workersView() {
        var onClick = function onClick(worker, e) {
          e.preventDefault();
          _modelsNav.navActions.push(_routes2['default'].person.view, { personId: worker.get('_id') });
        };

        if (!workers) return _react2['default'].createElement('div', null);

        return workers.map(function (worker) {
          return _react2['default'].createElement(
            'a',
            { key: worker.get('_id'), href: '#', onClick: onClick.bind(null, worker) },
            _react2['default'].createElement(_widgets.AvatarView, { obj: worker, size: 24, label: 'Worker ' + worker.get('name') })
          );
        }).toSetSeq();
      };

      var manager = function manager() {
        if (!_this2.props.manager) return;
        var onClick = function onClick(person, e) {
          e.preventDefault();
          _modelsNav.navActions.push(_routes2['default'].person.view, { personId: person.get('_id') });
        };

        return _react2['default'].createElement(
          'a',
          { href: '#', onClick: onClick.bind(null, _this2.props.manager) },
          _react2['default'].createElement(_widgets.AvatarView, { size: 24, label: 'Managed by ' + _this2.props.manager.get('name'), obj: _this2.props.manager })
        );
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
              { href: '#', onClick: this.handleViewMission },
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
            { style: styles.manager },
            manager()
          ),
          _react2['default'].createElement(
            'div',
            { style: styles.names },
            _react2['default'].createElement(
              'div',
              { style: styles.name, className: 'p-r-1' },
              missionView()
            ),
            companyView()
          ),
          _react2['default'].createElement(
            'div',
            { className: 'p-r-1', style: styles.workers },
            workersView()
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
