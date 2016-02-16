'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactFileInput = require('react-file-input');

var _reactFileInput2 = _interopRequireDefault(_reactFileInput);

var _remarkable = require('remarkable');

var _remarkable2 = _interopRequireDefault(_remarkable);

var _formsCompany = require('../forms/company');

var AvatarView = function AvatarView(_ref) {
  var obj = _ref.obj;
  var size = _ref.size;
  var label = _ref.label;

  if (!obj || !obj.get('avatar')) return _react2['default'].createElement(
    'div',
    { className: 'm-r-1' },
    _react2['default'].createElement(Avatar, { size: size, name: "?" })
  );

  var avatar = obj.get('avatar').toJS();
  var tooltip = label || obj.get('name');
  var defaultAvatar = _react2['default'].createElement(
    'div',
    { className: 'm-r-1' },
    _react2['default'].createElement(Avatar, { size: size, label: tooltip, name: obj.get('name'), color: avatar.color })
  );

  switch (avatar.type) {
    case 'url':
      return avatar.url ? _react2['default'].createElement(
        'div',
        { className: 'm-r-1' },
        _react2['default'].createElement(Avatar, { size: size, label: tooltip, src: avatar.url })
      ) : defaultAvatar;
    case 'src':
      return avatar.src ? _react2['default'].createElement(
        'div',
        { className: 'm-r-1' },
        _react2['default'].createElement(Avatar, { size: size, label: tooltip, src: avatar.src })
      ) : defaultAvatar;
    default:
      return defaultAvatar;
  }
};

exports.AvatarView = AvatarView;
AvatarView.propTypes = {
  obj: _react.PropTypes.object,
  size: _react.PropTypes.number,
  label: _react.PropTypes.string
};

var Avatar = (function (_Component) {
  _inherits(Avatar, _Component);

  function Avatar() {
    _classCallCheck(this, Avatar);

    _get(Object.getPrototypeOf(Avatar.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Avatar, [{
    key: 'rndColor',
    value: function rndColor() {
      var colors = ['#d73d32', '#7e3794', '#4285f4', '#67ae3f', '#d61a7f', '#ff4080'];
      var index = Math.floor(Math.random() * colors.length);
      return colors[index];
    }
  }, {
    key: 'getInitials',
    value: function getInitials() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

      var parts = name.split(' ').slice(0, 3);
      return _.map(parts, function (part) {
        return part.substr(0, 1).toUpperCase();
      }).join('');
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      $('[data-toggle="tooltip"]').tooltip('dispose');
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      $('[data-toggle="tooltip"]').tooltip();
    }
  }, {
    key: 'render',
    value: function render() {
      var size = this.props.size || 36;
      var styleSize = size + 'px';
      var imageStyle = {
        width: styleSize || '36px',
        height: styleSize || '36px',
        borderRadius: '50%'
      };

      var initialsStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: this.props.color || this.rndColor(),
        width: styleSize || '36px',
        height: styleSize || '36px',
        color: '#FFF',
        textTransform: 'uppercase',
        borderRadius: '50%',
        fontSize: size / 36 + 'rem'
      };

      if (this.props.src) {
        return _react2['default'].createElement(
          'div',
          { 'data-toggle': 'tooltip', 'data-placement': 'top', title: this.props.label },
          _react2['default'].createElement('img', { src: this.props.src, style: imageStyle })
        );
      } else {
        return _react2['default'].createElement(
          'div',
          { 'data-toggle': 'tooltip', 'data-placement': 'top', title: this.props.label, style: initialsStyle },
          this.getInitials(this.props.name)
        );
      }
    }
  }]);

  return Avatar;
})(_react.Component);

exports.Avatar = Avatar;

Avatar.propTypes = {
  size: _react.PropTypes.number,
  color: _react.PropTypes.string,
  src: _react.PropTypes.string,
  label: _react.PropTypes.string
};

var NewLabel = function NewLabel() {
  return _react2['default'].createElement(
    'span',
    { className: 'label label-success' },
    'new'
  );
};

exports.NewLabel = NewLabel;
var UpdatedLabel = function UpdatedLabel() {
  return _react2['default'].createElement(
    'span',
    { className: 'label label-info' },
    'updated'
  );
};

exports.UpdatedLabel = UpdatedLabel;
var TextLabel = function TextLabel(_ref2) {
  var label = _ref2.label;
  var value = _ref2.value;
  var url = _ref2.url;
  var onClick = _ref2.onClick;

  var labelUrl = function labelUrl() {
    if (!url && !onClick) return "";
    if (onClick) return _react2['default'].createElement(
      'a',
      { href: '#', onClick: onClick },
      _react2['default'].createElement('i', { className: 'fa fa-external-link p-l-1' })
    );
    if (url) return _react2['default'].createElement(
      'a',
      { href: url },
      _react2['default'].createElement('i', { className: 'fa fa-external-link p-l-1' })
    );
  };

  return _react2['default'].createElement(
    'fieldset',
    { className: 'form-group' },
    _react2['default'].createElement(
      'label',
      { htmlFor: label },
      label,
      labelUrl()
    ),
    _react2['default'].createElement(
      'span',
      { className: 'form-control', id: label },
      value
    )
  );
};

exports.TextLabel = TextLabel;
TextLabel.proptypes = {
  label: _react.PropTypes.string,
  value: _react.PropTypes.string,
  url: _react.PropTypes.string,
  onClick: _react.PropTypes.func
};

var Labels = function Labels(_ref3) {
  var label = _ref3.label;
  var value = _ref3.value;
  var onClick = _ref3.onClick;

  var styles = {
    label: {
      color: '#cfd2da',
      padding: '.3rem'
    }
  };

  var handleClick = function handleClick(label, e) {
    onClick(label);
    e.preventDefault();
  };

  var labels = undefined;
  if (!onClick) {
    labels = _.map(value.toJS(), function (v) {
      return _react2['default'].createElement(
        'span',
        { key: v, style: styles.label, className: 'label label-primary m-r-1' },
        v
      );
    });
  } else {
    labels = _.map(value.toJS(), function (v) {
      return _react2['default'].createElement(
        'span',
        { key: v, style: styles.label, className: 'label label-primary m-r-1' },
        _react2['default'].createElement(
          'a',
          { href: '#', onClick: handleClick.bind(null, v) },
          v
        )
      );
    });
  }

  return _react2['default'].createElement(
    'fieldset',
    { className: 'form-group' },
    _react2['default'].createElement(
      'label',
      { htmlFor: label },
      label
    ),
    _react2['default'].createElement(
      'div',
      { className: 'form-control', id: label },
      labels
    )
  );
};

exports.Labels = Labels;
Labels.propTypes = {
  label: _react.PropTypes.string,
  value: _react.PropTypes.object,
  onClick: _react.PropTypes.func
};

var MarkdownText = function MarkdownText(_ref4) {
  var label = _ref4.label;
  var value = _ref4.value;

  var md = new _remarkable2['default']();
  var text = { __html: md.render(value) };
  return _react2['default'].createElement(
    'fieldset',
    { className: 'form-group' },
    _react2['default'].createElement(
      'label',
      { htmlFor: label },
      label
    ),
    _react2['default'].createElement('div', { style: { height: '100%', minHeight: '36px' }, className: 'form-control', id: label, dangerouslySetInnerHTML: text })
  );
};

exports.MarkdownText = MarkdownText;
MarkdownText.propTypes = {
  label: _react.PropTypes.string,
  value: _react.PropTypes.string
};

var GoBack = function GoBack(_ref5) {
  var history = _ref5.history;
  var goBack = _ref5.goBack;
  var isLoading = _ref5.isLoading;

  var handleChange = function handleChange(e) {
    if (goBack) goBack();else history.goBack();
    e.preventDefault();
  };

  if (isLoading) {
    return _react2['default'].createElement('i', { className: 'fa fa-spinner fa-spin m-r-1' });
  } else {
    return _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { className: 'iconButton fa fa-arrow-left m-r-1' })
    );
  }
};

exports.GoBack = GoBack;
GoBack.propTypes = {
  history: _react.PropTypes.object,
  goBack: _react.PropTypes.func,
  isLoading: _react.PropTypes.bool
};

var Title = function Title(_ref6) {
  var title = _ref6.title;

  var styles = {
    name: {
      flexShrink: 0
    }
  };

  return _react2['default'].createElement(
    'div',
    { style: styles.name, className: 'm-r-1' },
    title
  );
};

exports.Title = Title;
Title.propTypes = {
  title: _react.PropTypes.string
};

var HeaderLeft = function HeaderLeft(_ref7) {
  var children = _ref7.children;

  var styles = {
    left: {
      display: 'flex',
      alignItems: 'center',
      flex: 1,
      minWidth: '500px'
    }
  };

  return _react2['default'].createElement(
    'div',
    { style: styles.left },
    children
  );
};

exports.HeaderLeft = HeaderLeft;
HeaderLeft.propTypes = {
  children: _react.PropTypes.node
};

var HeaderRight = function HeaderRight(_ref8) {
  var children = _ref8.children;

  var styles = {
    right: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flex: 1
    }
  };

  return _react2['default'].createElement(
    'div',
    { style: styles.right },
    children
  );
};

exports.HeaderRight = HeaderRight;
HeaderRight.propTypes = {
  children: _react.PropTypes.node
};

var Header = function Header(_ref9) {
  var obj = _ref9.obj;
  var children = _ref9.children;

  var styles = {
    container: {
      paddingTop: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    name: {
      flexShrink: 0
    },
    time: {
      fontSize: '.7rem',
      fontStyle: 'italic',
      display: 'block',
      float: 'right'
    }
  };

  var left = function left() {
    return _react2['default'].Children.toArray(children).find(function (child) {
      return child.type === HeaderLeft;
    });
  };

  var right = function right() {
    return _react2['default'].Children.toArray(children).find(function (child) {
      return child.type === HeaderRight;
    });
  };

  var timeLabels = function timeLabels(obj) {
    if (!obj || !obj.get('createdAt')) return _react2['default'].createElement('span', null);
    var res = ['Created ' + obj.get('createdAt').fromNow()];
    if (obj.get('updatedAt')) res.push('Updated ' + obj.get('updatedAt').fromNow());
    return _react2['default'].createElement(
      'span',
      null,
      res.join(' - ')
    );
  };

  var time = function time() {
    if (!obj) return "";
    return _react2['default'].createElement(
      'div',
      { style: styles.time },
      timeLabels(obj)
    );
  };

  return _react2['default'].createElement(
    'div',
    null,
    _react2['default'].createElement(
      'div',
      { style: styles.container, className: 'tm title' },
      left(),
      right()
    ),
    _react2['default'].createElement('hr', null),
    time()
  );
};

exports.Header = Header;
Header.propTypes = {
  obj: _react.PropTypes.object,
  children: _react.PropTypes.node
};

var Form = function Form(_ref10) {
  var children = _ref10.children;

  return _react2['default'].createElement(
    'form',
    null,
    children
  );
};

exports.Form = Form;
Form.propTypes = {
  children: _react.PropTypes.node
};

var AddBtn = function AddBtn(_ref11) {
  var onSubmit = _ref11.onSubmit;
  var canSubmit = _ref11.canSubmit;

  var handleChange = function handleChange(e) {
    onSubmit();
    e.preventDefault();
  };

  return _react2['default'].createElement(
    'button',
    { type: 'button', className: 'btn btn-primary m-l-1', disabled: !canSubmit, onClick: handleChange },
    'Create'
  );
};

exports.AddBtn = AddBtn;
AddBtn.propTypes = {
  onSubmit: _react.PropTypes.func.isRequired,
  canSubmit: _react.PropTypes.bool
};

var UpdateBtn = function UpdateBtn(_ref12) {
  var onSubmit = _ref12.onSubmit;
  var canSubmit = _ref12.canSubmit;
  var label = _ref12.label;
  var size = _ref12.size;

  var handleChange = function handleChange(e) {
    onSubmit();
    e.preventDefault();
  };

  var classnames = (0, _classnames2['default'])("btn btn-primary m-l-1", {
    'btn-sm': size === 'small',
    'btn-lg': size === 'large'
  });

  return _react2['default'].createElement(
    'button',
    { type: 'button', className: classnames, disabled: !canSubmit, onClick: handleChange },
    label || 'Update'
  );
};

exports.UpdateBtn = UpdateBtn;
UpdateBtn.propTypes = {
  onSubmit: _react.PropTypes.func.isRequired,
  canSubmit: _react.PropTypes.bool,
  label: _react.PropTypes.string,
  size: _react.PropTypes.string
};

var CancelBtn = function CancelBtn(_ref13) {
  var onCancel = _ref13.onCancel;
  var label = _ref13.label;
  var size = _ref13.size;

  var handleChange = function handleChange(e) {
    onCancel();
    e.preventDefault();
  };

  var classnames = (0, _classnames2['default'])("btn btn-warning m-l-1", {
    'btn-sm': size === 'small',
    'btn-lg': size === 'large'
  });

  return _react2['default'].createElement(
    'button',
    { type: 'button', className: classnames, onClick: handleChange },
    label || 'Cancel'
  );
};

exports.CancelBtn = CancelBtn;
CancelBtn.propTypes = {
  onCancel: _react.PropTypes.func.isRequired,
  label: _react.PropTypes.string,
  size: _react.PropTypes.string
};

var ResetBtn = function ResetBtn(_ref14) {
  var obj = _ref14.obj;
  var label = _ref14.label;
  var size = _ref14.size;

  var handleChange = function handleChange(e) {
    obj.reset();
    e.preventDefault();
  };

  var classnames = (0, _classnames2['default'])("btn btn-danger m-l-1", {
    'btn-sm': size === 'small',
    'btn-lg': size === 'large'
  });

  return _react2['default'].createElement(
    'button',
    { type: 'button', className: classnames, onClick: handleChange },
    label || 'Reset'
  );
};

exports.ResetBtn = ResetBtn;
ResetBtn.propTypes = {
  obj: _react.PropTypes.object.isRequired,
  label: _react.PropTypes.string,
  size: _react.PropTypes.string
};

var Refresh = function Refresh(_ref15) {
  var onClick = _ref15.onClick;

  var handleChange = function handleChange(e) {
    onClick();
    e.preventDefault();
  };

  var style = {
    fontSize: '1.5rem'
  };

  return _react2['default'].createElement(
    'div',
    { className: 'm-l-1' },
    _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { style: style, className: 'iconButton fa fa-refresh' })
    )
  );
};

exports.Refresh = Refresh;
Refresh.propTypes = {
  onClick: _react.PropTypes.func.isRequired
};

var Filter = function Filter(_ref16) {
  var filter = _ref16.filter;
  var onChange = _ref16.onChange;
  var onReset = _ref16.onReset;

  var handleChange = function handleChange(e) {
    onChange(e.target.value);
    e.preventDefault();
  };

  var handleClick = function handleClick(e) {
    onReset();
    e.preventDefault();
  };

  var styles = {
    container: {
      position: 'relative'
    },
    icon: {
      position: 'absolute',
      padding: '10px',
      right: '0px',
      top: '-1px',
      fontSize: '1.2rem',
      zIndex: 10,
      color: 'grey'
    }
  };

  var icon = _react2['default'].createElement('span', { className: 'fa fa-search' });

  return _react2['default'].createElement(
    'div',
    { className: 'm-l-1', style: styles.container },
    _react2['default'].createElement('input', { className: 'tm input form-control', type: 'text', value: filter, placeholder: 'search ...', onChange: handleChange }),
    _react2['default'].createElement(
      'a',
      { href: '#' },
      _react2['default'].createElement('i', { className: 'fa fa-ban', style: styles.icon, onClick: handleClick })
    )
  );
};

exports.Filter = Filter;
Filter.propTypes = {
  onChange: _react.PropTypes.func.isRequired,
  onReset: _react.PropTypes.func.isRequired,
  filter: _react.PropTypes.string
};

var FilterPreferred = function FilterPreferred(_ref17) {
  var preferred = _ref17.preferred;
  var onClick = _ref17.onClick;

  var handleChange = function handleChange(e) {
    onClick();
    e.preventDefault();
  };

  var style = {
    fontSize: '1.5rem',
    color: preferred ? '#00BCD4' : 'grey'
  };

  return _react2['default'].createElement(
    'div',
    { className: 'm-l-1' },
    _react2['default'].createElement(
      'a',
      { href: '#', onClick: handleChange },
      _react2['default'].createElement('i', { style: style, className: 'iconButton fa fa-star-o' })
    )
  );
};

exports.FilterPreferred = FilterPreferred;
FilterPreferred.propTypes = {
  preferred: _react.PropTypes.bool,
  onClick: _react.PropTypes.func.isRequired
};

var Sort = function Sort(_ref18) {
  var sortMenu = _ref18.sortMenu;
  var sortCond = _ref18.sortCond;
  var onClick = _ref18.onClick;

  var handleClick = function handleClick(mode, e) {
    onClick(mode);
    e.preventDefault();
  };

  function getSortIcon(sortCond, item) {
    if (item.key === sortCond.by) {
      var classnames = sortCond.order === "desc" ? "fa fa-sort-desc p-l-1" : "fa fa-sort-asc p-l-1";
      return _react2['default'].createElement('i', { className: classnames });
    }
  }

  var styles = {
    button: {
      fontSize: '1.5rem'
    },
    menu: {
      marginTop: '15px'
    }
  };

  var menu = _.map(sortMenu, function (item) {
    return _react2['default'].createElement(
      'a',
      { key: item.key, className: 'dropdown-item p-a', href: '#', onClick: handleClick.bind(null, item.key) },
      item.label,
      getSortIcon(sortCond, item)
    );
  });

  return _react2['default'].createElement(
    'div',
    { className: 'dropdown m-l-1' },
    _react2['default'].createElement(
      'a',
      { href: '#', id: 'sort-menu', 'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'true' },
      _react2['default'].createElement('i', { style: styles.button, className: 'iconButton fa fa-sort' })
    ),
    _react2['default'].createElement(
      'ul',
      { style: styles.menu, className: 'dropdown-menu dropdown-menu-right', 'aria-labelledby': 'sort-menu' },
      menu
    )
  );
};

exports.Sort = Sort;
Sort.propTypes = {
  sortMenu: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
  sortCond: _react.PropTypes.object.isRequired,
  onClick: _react.PropTypes.func.isRequired
};

var TitleIcon = function TitleIcon(_ref19) {
  var icon = _ref19.icon;
  var isLoading = _ref19.isLoading;

  return isLoading ? _react2['default'].createElement('i', { className: 'fa fa-spinner fa-spin m-r-1' }) : _react2['default'].createElement('i', { className: 'fa fa-' + icon + ' m-r-1' });
};

exports.TitleIcon = TitleIcon;
TitleIcon.propTypes = {
  icon: _react.PropTypes.string.isRequired,
  isLoading: _react.PropTypes.bool
};
//# sourceMappingURL=widgets.js.map
