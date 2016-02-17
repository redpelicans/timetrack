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

var _modelsNotes = require('../models/notes');

var _modelsPersons = require('../models/persons');

var _modelsNav = require('../models/nav');

var _modelsLogin = require('../models/login');

var _formsNote = require('../forms/note');

var _formsNote2 = _interopRequireDefault(_formsNote);

var _widgets = require('./widgets');

var _fields = require('./fields');

var _remarkable = require('remarkable');

var _remarkable2 = _interopRequireDefault(_remarkable);

var _auths = require('../auths');

var _auths2 = _interopRequireDefault(_auths);

var Notes = (function (_Component) {
  _inherits(Notes, _Component);

  function Notes() {
    var _this = this;

    _classCallCheck(this, Notes);

    _get(Object.getPrototypeOf(Notes.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      notes: _immutable2['default'].Map(),
      persons: _immutable2['default'].Map(),
      showAddNotePanel: false
    };

    this.handleAddNote = function (e) {
      e.preventDefault();
      _this.setState({ showAddNotePanel: true });
    };
  }

  //@reactMixin.decorate(Lifecycle)

  _createClass(Notes, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeNotes) this.unsubscribeNotes();
      if (this.unsubscribePersons) this.unsubscribePersons();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.unsubscribeNotes = _modelsNotes.notesStore.listen(function (state) {
        // TODO: to be optimized to avoid render if filtered notes do not change
        var notes = state.data.filter(function (note) {
          return note.get('entityId') === _this2.props.entity.get('_id');
        });
        var data = { notes: notes };
        // if(this.state.showAddNotePanel === undefined) data.showAddNotePanel = !notes.size;
        //else if(notes.size === 0) data.showAddNotePanel = true;
        _this2.setState(data);
      });

      this.unsubscribePersons = _modelsPersons.personsStore.listen(function (state) {
        _this2.setState({ persons: state.data });
      });

      _modelsPersons.personsActions.load();
      _modelsNotes.notesActions.load();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

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

      var label = this.props.label || 'Notes';
      var notes = this.state.notes.sort(function (a, b) {
        return a.get('createdAt') < b.get('createdAt');
      }).map(function (note) {
        return _react2['default'].createElement(Note, {
          key: note.get('_id'),
          note: note,
          persons: _this3.state.persons,
          entity: _this3.props.entity });
      }).toSetSeq();

      var addNote = function addNote() {
        if (_this3.state.showAddNotePanel) return;
        return _react2['default'].createElement(
          'div',
          null,
          _react2['default'].createElement(
            'a',
            { href: '#', onClick: _this3.handleAddNote },
            _react2['default'].createElement('i', { style: styles.add, className: 'iconButton fa fa-plus m-l-1' })
          )
        );
      };

      var addNotePanel = function addNotePanel() {
        if (!_this3.state.showAddNotePanel) return;
        var handleCancel = function handleCancel() {
          return _this3.setState({ showAddNotePanel: false });
        };
        var handleSubmit = function handleSubmit(newNote) {
          _this3.setState({ showAddNotePanel: false });
          _modelsNotes.notesActions.create(newNote, _this3.props.entity.toJS());
        };

        return _react2['default'].createElement(
          'div',
          { style: styles.addNotePanel },
          _react2['default'].createElement(EditNote, {
            author: _modelsLogin.loginStore.getUser(),
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
        notes
      );
    }
  }]);

  return Notes;
})(_react.Component);

exports['default'] = Notes;

var Note = (function (_Component2) {
  _inherits(Note, _Component2);

  function Note() {
    _classCallCheck(this, Note);

    _get(Object.getPrototypeOf(Note.prototype), 'constructor', this).apply(this, arguments);

    this.state = { mode: 'view' };
  }

  _createClass(Note, [{
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props;
      var note = _props.note;
      var persons = _props.persons;
      var entity = _props.entity;

      var viewMode = function viewMode() {
        var handleEdit = function handleEdit() {
          return _this4.setState({ mode: 'edit' });
        };
        var handleDelete = function handleDelete() {
          return _this4.setState({ mode: 'delete' });
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
          return _this4.setState({ mode: 'view' });
        };
        var handleSubmit = function handleSubmit(newNote) {
          _this4.setState({ mode: 'view' });
          _modelsNotes.notesActions.update(note.toJS(), newNote);
        };

        return _react2['default'].createElement(EditNote, {
          onSubmit: handleSubmit,
          onCancel: handleCancel,
          author: persons && persons.get(note.get('authorId')),
          note: note });
      };

      var deleteMode = function deleteMode() {
        var handleCancel = function handleCancel() {
          return _this4.setState({ mode: 'view' });
        };
        var handleDelete = function handleDelete() {
          _modelsNotes.notesActions['delete'](_this4.props.note.toJS());
          _this4.setState({ mode: 'view' });
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
        switch (_this4.state.mode) {
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

  return Note;
})(_react.Component);

var EditNote = (function (_Component3) {
  _inherits(EditNote, _Component3);

  function EditNote() {
    var _this5 = this;

    _classCallCheck(this, EditNote);

    _get(Object.getPrototypeOf(EditNote.prototype), 'constructor', this).apply(this, arguments);

    this.state = { forceLeave: false };

    this.handleSubmit = function () {
      _this5.noteForm.submit();
    };

    this.handleCancel = function () {
      _this5.props.onCancel();
    };

    this.handleViewAuthor = function (author, e) {
      e.preventDefault();
      _modelsNav.navActions.push(_routes2['default'].person.view, { personId: author.get('_id') });
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
      var _this6 = this;

      this.noteForm = this.props.note ? (0, _formsNote2['default'])({ content: this.props.note.get('content') }) : (0, _formsNote2['default'])();
      this.unsubscribeSubmit = this.noteForm.onSubmit(function (state, document) {
        _this6.props.onSubmit(document);
      });

      this.unsubscribeState = this.noteForm.onValue(function (state) {
        _this6.setState({
          canSubmit: state.canSubmit,
          hasBeenModified: state.hasBeenModified
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

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
            { href: '#', onClick: _this7.handleViewAuthor.bind(null, person) },
            _react2['default'].createElement(_widgets.AvatarView, { obj: person, size: 24, label: 'Wrote by ' + person.get('name') })
          )
        );
      };

      var time = function time() {
        var createdAt = _this7.props.note ? _this7.props.note.get('createdAt') : (0, _moment2['default'])();
        return _react2['default'].createElement(
          'div',
          { style: styles.time },
          createdAt.format("dddd, MMMM Do YYYY")
        );
      };

      var submitBtn = _react2['default'].createElement(_widgets.UpdateBtn, {
        onSubmit: this.handleSubmit,
        canSubmit: this.state.canSubmit && this.state.hasBeenModified,
        label: this.props.note ? 'Update' : 'Create',
        size: "small" });

      var cancelBtn = _react2['default'].createElement(_widgets.CancelBtn, {
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
        _react2['default'].createElement(_fields.MarkdownEditField, { focused: true, field: this.noteForm.field('content') })
      );
    }
  }]);

  return EditNote;
})(_react.Component);

var ViewNote = (function (_Component4) {
  _inherits(ViewNote, _Component4);

  function ViewNote() {
    var _this8 = this;

    _classCallCheck(this, ViewNote);

    _get(Object.getPrototypeOf(ViewNote.prototype), 'constructor', this).apply(this, arguments);

    this.state = { editable: false };

    this.handleViewAuthor = function (author, e) {
      e.preventDefault();
      _modelsNav.navActions.push(_routes2['default'].person.view, { personId: author.get('_id') });
    };

    this.handleMouseEnter = function (e) {
      _this8.setState({ editable: true });
    };

    this.handleMouseLeave = function (e) {
      _this8.setState({ editable: false });
    };
  }

  _createClass(ViewNote, [{
    key: 'render',
    value: function render() {
      var _this9 = this;

      var _props2 = this.props;
      var note = _props2.note;
      var persons = _props2.persons;
      var entity = _props2.entity;

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
            { href: '#', onClick: _this9.handleViewAuthor.bind(null, person) },
            _react2['default'].createElement(_widgets.AvatarView, { obj: person, size: 24, label: 'Wrote by ' + person.get('name') })
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
          _this9.props.onDelele();
        };
        if (!_this9.state.editable || _this9.props.mode === 'delete') return;
        return _react2['default'].createElement(
          'a',
          { href: '#', onClick: handleClick },
          _react2['default'].createElement('i', { className: 'iconButton fa fa-trash m-r-1' })
        );
      };

      var edit = function edit() {
        var handleClick = function handleClick(e) {
          e.preventDefault();
          _this9.props.onEdit();
        };
        if (!_this9.state.editable || _this9.props.mode === 'delete') return;
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
        if (_this9.props.mode !== 'delete') return;
        var handleDelete = function handleDelete(e) {
          e.preventDefault();
          _this9.props.onDelele();
        };
        var handleCancel = function handleCancel(e) {
          e.preventDefault();
          _this9.props.onCancel();
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

  return ViewNote;
})(_react.Component);

module.exports = exports['default'];
//# sourceMappingURL=notes.js.map
