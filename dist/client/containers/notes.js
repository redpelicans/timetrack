'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMixin = require('react-mixin');

var _reactMixin2 = _interopRequireDefault(_reactMixin);

var _reactRouter = require('react-router');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

var _formsNote = require('../forms/note');

var _formsNote2 = _interopRequireDefault(_formsNote);

var _componentsWidgets = require('../components/widgets');

var _componentsFields = require('../components/fields');

var _remarkable = require('remarkable');

var _remarkable2 = _interopRequireDefault(_remarkable);

var _reactRedux = require('react-redux');

var _selectorsNotes = require('../selectors/notes');

var _actionsNotes = require('../actions/notes');

var _actionsPersons = require('../actions/persons');

var _componentsAuthmanager = require('../components/authmanager');

var _actionsRoutes = require('../actions/routes');

var Notes = (function (_Component) {
  _inherits(Notes, _Component);

  function Notes() {
    var _this = this;

    _classCallCheck(this, Notes);

    _get(Object.getPrototypeOf(Notes.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      showAddNotePanel: false
    };

    this.handleAddNote = function (e) {
      e.preventDefault();
      _this.setState({ showAddNotePanel: true });
    };
  }

  _createClass(Notes, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.dispatch(_actionsPersons.personsActions.load());
      this.props.dispatch(_actionsNotes.notesActions.load());
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props;
      var notes = _props.notes;
      var persons = _props.persons;
      var entity = _props.entity;
      var user = _props.user;
      var _props$label = _props.label;
      var label = _props$label === undefined ? 'Notes' : _props$label;
      var dispatch = _props.dispatch;

      var styles = {
        label: {
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.5rem'
        },
        addNotePanel: {
          marginBottom: '1rem'
        }
      };

      var sortedNotes = notes.sort(function (a, b) {
        return a.get('createdAt') < b.get('createdAt');
      }).map(function (note) {
        return _react2['default'].createElement(Note, {
          key: note.get('_id'),
          note: note,
          persons: persons,
          entity: entity });
      }).toSetSeq();

      var addNote = function addNote() {
        if (_this2.state.showAddNotePanel) return;
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'a',
            { href: '#', onClick: _this2.handleAddNote },
            _react2['default'].createElement('i', { style: styles.add, className: 'iconButton fa fa-plus m-l-1' })
          )
        );
      };

      var addNotePanel = function addNotePanel() {
        if (!_this2.state.showAddNotePanel) return;
        var handleCancel = function handleCancel() {
          return _this2.setState({ showAddNotePanel: false });
        };
        var handleSubmit = function handleSubmit(newNote) {
          _this2.setState({ showAddNotePanel: false });
          dispatch(_actionsNotes.notesActions.create(newNote, entity.toJS()));
        };

        return _react2['default'].createElement(
          'div',
          { style: styles.addNotePanel },
          _react2['default'].createElement(EditNote, {
            author: user,
            onSubmit: handleSubmit,
            onCancel: handleCancel })
        );
      };

      return _react2['default'].createElement(
        'fieldset',
        { className: 'form-group' },
        _react2['default'].createElement(
          'div',
          { style: styles.label },
          _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'span',
              null,
              label
            )
          ),
          addNote()
        ),
        addNotePanel(),
        sortedNotes
      );
    }
  }]);

  return Notes;
})(_react.Component);

Notes.propTypes = {
  dispatch: _react.PropTypes.func.isRequired,
  entity: _react.PropTypes.object.isRequired,
  user: _react.PropTypes.object,
  label: _react.PropTypes.string,
  persons: _react.PropTypes.object,
  notes: _react.PropTypes.object
};

var Note = (function (_Component2) {
  _inherits(Note, _Component2);

  function Note() {
    _classCallCheck(this, _Note);

    _get(Object.getPrototypeOf(_Note.prototype), 'constructor', this).apply(this, arguments);

    this.state = { mode: 'view' };
  }

  _createClass(Note, [{
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props2 = this.props;
      var note = _props2.note;
      var persons = _props2.persons;
      var entity = _props2.entity;
      var dispatch = this.context.dispatch;

      var viewMode = function viewMode() {
        var handleEdit = function handleEdit() {
          return _this3.setState({ mode: 'edit' });
        };
        var handleDelete = function handleDelete() {
          return _this3.setState({ mode: 'delete' });
        };

        return _react2['default'].createElement(ViewNote, {
          mode: 'view',
          note: note,
          persons: persons,
          entity: entity,
          onEdit: handleEdit,
          onDelele: handleDelete });
      };

      var editMode = function editMode() {
        var handleCancel = function handleCancel() {
          return _this3.setState({ mode: 'view' });
        };
        var handleSubmit = function handleSubmit(newNote) {
          _this3.setState({ mode: 'view' });
          dispatch(_actionsNotes.notesActions.update(note.toJS(), newNote));
        };

        return _react2['default'].createElement(EditNote, {
          onSubmit: handleSubmit,
          onCancel: handleCancel,
          author: persons && persons.get(note.get('authorId')),
          note: note });
      };

      var deleteMode = function deleteMode() {
        var handleCancel = function handleCancel() {
          return _this3.setState({ mode: 'view' });
        };
        var handleDelete = function handleDelete() {
          dispatch(_actionsNotes.notesActions['delete'](note.toJS()));
          _this3.setState({ mode: 'view' });
        };

        return _react2['default'].createElement(ViewNote, {
          mode: 'delete',
          note: note,
          persons: persons,
          entity: entity,
          onCancel: handleCancel,
          onDelele: handleDelete });
      };

      var selectMode = function selectMode() {
        switch (_this3.state.mode) {
          case 'edit':
            return editMode();
          case 'delete':
            return deleteMode();
          default:
            return viewMode();
        }
      };

      return _react2['default'].createElement(
        'div',
        { className: 'row' },
        _react2['default'].createElement(
          'div',
          { className: 'col-md-12' },
          _react2['default'].createElement(
            'fieldset',
            { className: 'form-group' },
            selectMode()
          )
        )
      );
    }
  }]);

  var _Note = Note;
  Note = (0, _componentsAuthmanager.authable)(Note) || Note;
  return Note;
})(_react.Component);

Note.propTypes = {
  note: _react.PropTypes.object.isRequired,
  entity: _react.PropTypes.object.isRequired,
  persons: _react.PropTypes.object
};

var EditNote = (function (_Component3) {
  _inherits(EditNote, _Component3);

  function EditNote() {
    var _this4 = this;

    _classCallCheck(this, _EditNote);

    _get(Object.getPrototypeOf(_EditNote.prototype), 'constructor', this).apply(this, arguments);

    this.state = { forceLeave: false };

    this.handleSubmit = function () {
      _this4.noteForm.submit();
    };

    this.handleCancel = function () {
      _this4.props.onCancel();
    };

    this.handleViewAuthor = function (author, e) {
      e.preventDefault();
      _this4.context.dispatch((0, _actionsRoutes.pushRoute)(_routes2['default'].person.view, { personId: author.get('_id') }));
    };
  }

  _createClass(EditNote, [{
    key: 'componentWillUnmount',

    // routerWillLeave = nextLocation => {
    //   if(!this.state.forceLeave && this.state.hasBeenModified) return "Are you sure you want to leave the page without saving updates?";
    //   return true;
    // }

    value: function componentWillUnmount() {
      if (this.unsubscribeSubmit) this.unsubscribeSubmit();
      if (this.unsubscribeState) this.unsubscribeState();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this5 = this;

      var note = this.props.note;

      this.noteForm = note ? (0, _formsNote2['default'])({ content: note.get('content') }) : (0, _formsNote2['default'])();
      this.unsubscribeSubmit = this.noteForm.onSubmit(function (state, document) {
        _this5.props.onSubmit(document);
      });

      this.unsubscribeState = this.noteForm.onValue(function (state) {
        _this5.setState({
          canSubmit: state.canSubmit,
          hasBeenModified: state.hasBeenModified
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var styles = {
        container: {
          height: '100%'
        },
        header: {
          display: 'flex',
          justifyContent: 'space-between'
        },
        left: {
          display: 'flex',
          alignItems: 'center'
        },
        right: {
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }
      };

      var avatar = function avatar(person) {
        if (!person) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'a',
            { href: '#', onClick: _this6.handleViewAuthor.bind(null, person) },
            _react2['default'].createElement(_componentsWidgets.AvatarView, { obj: person, size: 24, label: 'Wrote by ' + person.get('name') })
          )
        );
      };

      var time = function time() {
        var createdAt = _this6.props.note ? _this6.props.note.get('createdAt') : (0, _moment2['default'])();
        return _react2['default'].createElement(
          'div',
          { style: styles.time },
          createdAt.format("dddd, MMMM Do YYYY")
        );
      };

      var submitBtn = _react2['default'].createElement(_componentsWidgets.UpdateBtn, {
        onSubmit: this.handleSubmit,
        canSubmit: this.state.canSubmit && this.state.hasBeenModified,
        label: this.props.note ? 'Update' : 'Create',
        size: "small" });

      var cancelBtn = _react2['default'].createElement(_componentsWidgets.CancelBtn, {
        onCancel: this.handleCancel,
        size: 'small' });

      return _react2['default'].createElement(
        'div',
        { className: 'form-control', style: styles.container },
        _react2['default'].createElement(
          'div',
          { style: styles.header },
          _react2['default'].createElement(
            'div',
            { style: styles.left },
            avatar(this.props.author),
            time()
          ),
          _react2['default'].createElement(
            'div',
            { style: styles.right },
            submitBtn,
            cancelBtn
          )
        ),
        _react2['default'].createElement(_componentsFields.MarkdownEditField, { focused: true, field: this.noteForm.field('content') })
      );
    }
  }]);

  var _EditNote = EditNote;
  EditNote = (0, _componentsAuthmanager.authable)(EditNote) || EditNote;
  return EditNote;
})(_react.Component);

Note.propTypes = {
  note: _react.PropTypes.object,
  author: _react.PropTypes.object,
  onCancel: _react.PropTypes.func,
  onSubmit: _react.PropTypes.func
};

var ViewNote = (function (_Component4) {
  _inherits(ViewNote, _Component4);

  function ViewNote() {
    var _this7 = this;

    _classCallCheck(this, _ViewNote);

    _get(Object.getPrototypeOf(_ViewNote.prototype), 'constructor', this).apply(this, arguments);

    this.state = { editable: false };

    this.handleViewAuthor = function (author, e) {
      e.preventDefault();
      _this7.context.dispatch((0, _actionsRoutes.pushRoute)(_routes2['default'].person.view, { personId: author.get('_id') }));
    };

    this.handleMouseEnter = function (e) {
      _this7.setState({ editable: true });
    };

    this.handleMouseLeave = function (e) {
      _this7.setState({ editable: false });
    };
  }

  _createClass(ViewNote, [{
    key: 'render',
    value: function render() {
      var _this8 = this;

      var _props3 = this.props;
      var mode = _props3.mode;
      var note = _props3.note;
      var persons = _props3.persons;
      var entity = _props3.entity;
      var onCancel = _props3.onCancel;
      var onDelele = _props3.onDelele;
      var onEdit = _props3.onEdit;

      var md = new _remarkable2['default']();
      var text = { __html: md.render(note.get('content')) };

      var styles = {
        content: {
          height: '100%',
          minHeight: '36px',
          zIndex: 1
        },
        note: {
          position: 'relative',
          zIndex: 0
        },
        deletePanel: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#434857',
          position: 'absolute',
          top: '0px',
          left: '0px',
          height: '100%',
          width: '100%',
          zIndex: 2,
          opacity: '.8'
        },
        container: {
          height: '100%'
        },
        time: {
          fontSize: '.7rem',
          fontStyle: 'italic',
          display: 'block'
        },
        //float: 'right',
        header: {
          display: 'flex',
          justifyContent: 'space-between'
        },
        left: {
          display: 'flex',
          alignItems: 'center'
        },
        right: {
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }
      };

      var avatar = function avatar(person) {
        if (!person) return _react2['default'].createElement('div', null);
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'a',
            { href: '#', onClick: _this8.handleViewAuthor.bind(null, person) },
            _react2['default'].createElement(_componentsWidgets.AvatarView, { obj: person, size: 24, label: 'Wrote by ' + person.get('name') })
          )
        );
      };

      var time = function time() {
        return _react2['default'].createElement(
          'div',
          { style: styles.time },
          note.get('createdAt').format("dddd, MMMM Do YYYY")
        );
      };

      var del = function del() {
        var handleClick = function handleClick(e) {
          e.preventDefault();
          onDelele();
        };
        if (!_this8.state.editable || mode === 'delete') return;
        return _react2['default'].createElement(
          'a',
          { href: '#', onClick: handleClick },
          _react2['default'].createElement('i', { className: 'iconButton fa fa-trash m-r-1' })
        );
      };

      var edit = function edit() {
        var handleClick = function handleClick(e) {
          e.preventDefault();
          onEdit();
        };
        if (!_this8.state.editable || mode === 'delete') return;
        return _react2['default'].createElement(
          'a',
          { href: '#', onClick: handleClick },
          _react2['default'].createElement('i', { className: 'iconButton fa fa-pencil m-r-1' })
        );
      };

      var header = function header() {
        var author = persons && persons.get(note.get('authorId'));
        return _react2['default'].createElement(
          'div',
          { style: styles.header, className: 'p-b-1' },
          _react2['default'].createElement(
            'div',
            { style: styles.left },
            avatar(author),
            time()
          ),
          _react2['default'].createElement(
            'div',
            { style: styles.right },
            edit(),
            del()
          )
        );
      };

      var deletePanel = function deletePanel() {
        if (mode !== 'delete') return;
        var handleDelete = function handleDelete(e) {
          e.preventDefault();
          onDelele();
        };
        var handleCancel = function handleCancel(e) {
          e.preventDefault();
          onCancel();
        };
        return _react2['default'].createElement(
          'div',
          { style: styles.deletePanel },
          _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'button',
              { type: 'button', className: 'btn btn-danger m-l-1', onClick: handleDelete },
              'Delete'
            )
          ),
          _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
              'button',
              { type: 'button', className: 'btn btn-warning m-l-1', onClick: handleCancel },
              'Cancel'
            )
          )
        );
      };

      return _react2['default'].createElement(
        'div',
        { className: 'form-control', style: styles.container, onMouseOver: this.handleMouseEnter, onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave },
        header(),
        _react2['default'].createElement(
          'div',
          { style: styles.note },
          _react2['default'].createElement('div', { ref: note.get('_id'), style: styles.content, dangerouslySetInnerHTML: text }),
          deletePanel()
        )
      );
    }
  }]);

  var _ViewNote = ViewNote;
  ViewNote = (0, _componentsAuthmanager.authable)(ViewNote) || ViewNote;
  return ViewNote;
})(_react.Component);

ViewNote.propTypes = {
  mode: _react.PropTypes.string.isRequired,
  note: _react.PropTypes.object.isRequired,
  persons: _react.PropTypes.object.isRequired,
  entity: _react.PropTypes.object.isRequired,
  onEdit: _react.PropTypes.func,
  onCancel: _react.PropTypes.func,
  onDelete: _react.PropTypes.func
};

exports['default'] = (0, _reactRedux.connect)(_selectorsNotes.notesSelector)(Notes);
module.exports = exports['default'];
//# sourceMappingURL=notes.js.map
