import moment from 'moment';
import React, {Component, PropTypes} from 'react';
import reactMixin from 'react-mixin';
import { Lifecycle } from 'react-router';
import classNames from 'classnames';
import Immutable from 'immutable';
import routes from '../routes';
import noteForm from '../forms/note';
import {AvatarView, MarkdownText, UpdateBtn, CancelBtn} from '../components/widgets';
import {MarkdownEditField} from '../components/fields';
import Remarkable from 'remarkable';
import { connect } from 'react-redux';
import {notesSelector} from '../selectors/notes';
import {notesActions} from '../actions/notes';
import {personsActions} from '../actions/persons';
import {authable} from '../components/authmanager';
import {pushRoute} from '../actions/routes';

class Notes extends Component{
  state = {
    showAddNotePanel: false,
  }

  componentWillMount(){
    this.props.dispatch(personsActions.load());
    this.props.dispatch(notesActions.load());
  }

  handleAddNote = (e) => {
    e.preventDefault();
    this.setState({showAddNotePanel: true});
  }

  render(){
    const {notes, persons, entity, user, label='Notes', dispatch} = this.props;
    const styles = {
      label:{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5rem',
      },
      addNotePanel:{
        marginBottom: '1rem',
      }
    }

    const sortedNotes = notes.sort( (a,b) => a.get('createdAt') < b.get('createdAt')).map(note => {
      return (
        <Note
          key={note.get('_id')}
          note={note}
          persons={persons}
          entity={entity}/>
      )
    }).toSetSeq();

    const addNote = () => {
      if(this.state.showAddNotePanel) return;
      return (
        <div>
          <a href="#" onClick={this.handleAddNote} >
            <i style={styles.add} className="iconButton fa fa-plus m-l-1"/>
          </a>
        </div>
      )
    }

    const addNotePanel = () => {
      if(!this.state.showAddNotePanel)return;
      const handleCancel = () => this.setState({showAddNotePanel: false});
      const handleSubmit = (newNote) => {
        this.setState({showAddNotePanel: false});
        dispatch(notesActions.create(newNote, entity.toJS()));
      }

      return (
        <div style={styles.addNotePanel}>
          <EditNote
            author={user}
            onSubmit={handleSubmit}
            onCancel={handleCancel}/>
        </div>
      )
    }

    return (
      <fieldset className="form-group">
        <div style={styles.label}>
          <div><span>{label}</span></div>
          {addNote()}
        </div>
        {addNotePanel()}
        {sortedNotes}
      </fieldset>
    )
  }
}

Notes.propTypes = {
  dispatch:   PropTypes.func.isRequired,
  entity:     PropTypes.object.isRequired,
  user:       PropTypes.object,
  label:      PropTypes.string,
  persons:    PropTypes.object,
  notes:      PropTypes.object,
}


@authable
export class Note extends Component{
  state = {mode: 'view'};

  render(){
    const {note, persons, entity} = this.props;
    const {dispatch} = this.context;

    const viewMode = () => {
      const handleEdit = () => this.setState({mode: 'edit'});
      const handleDelete = () => this.setState({mode: 'delete'});

      return (
        <ViewNote
          mode={'view'}
          note={note}
          persons={persons}
          entity={entity}
          onEdit={handleEdit}
          onDelele={handleDelete}/>
      )
    }

    const editMode = () => {
      const handleCancel = () => this.setState({mode: 'view'});
      const handleSubmit = (newNote) => {
        this.setState({mode: 'view'});
        dispatch(notesActions.update(note.toJS(), newNote));
      }

      return (
        <EditNote
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          author={persons && persons.get(note.get('authorId'))}
          note={note}/>
      )
    }

    const deleteMode = () => {
      const handleCancel = () => this.setState({mode: 'view'});
      const handleDelete = () => {
        dispatch(notesActions.delete(note.toJS()));
        this.setState({mode: 'view'});
      }

      return (
        <ViewNote
          mode={'delete'}
          note={note}
          persons={persons}
          entity={entity}
          onCancel={handleCancel}
          onDelele={handleDelete}/>
      )
    }

    const selectMode = () => {
      switch(this.state.mode){
        case 'edit':
          return editMode();
        case 'delete':
          return deleteMode();
        default: return viewMode();
      }
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <fieldset className="form-group">
            {selectMode()}
          </fieldset>
        </div>
      </div>
    )
  }
}

Note.propTypes = {
  note:     PropTypes.object.isRequired,
  entity:   PropTypes.object.isRequired,
  persons:  PropTypes.object,
}


@authable
class EditNote extends Component{

  state = { forceLeave: false }

  // routerWillLeave = nextLocation => {
  //   if(!this.state.forceLeave && this.state.hasBeenModified) return "Are you sure you want to leave the page without saving updates?";
  //   return true;
  // }

  componentWillUnmount(){
    if(this.unsubscribeSubmit) this.unsubscribeSubmit();
    if(this.unsubscribeState) this.unsubscribeState();
  }

  componentWillMount(){
    const {note} = this.props;
    this.noteForm = note ? noteForm({content: note.get('content')}) : noteForm();
    this.unsubscribeSubmit = this.noteForm.onSubmit( (state, document) => {
      this.props.onSubmit(document);
    });

    this.unsubscribeState = this.noteForm.onValue( state => {
      this.setState({
        canSubmit: state.canSubmit,
        hasBeenModified: state.hasBeenModified,
      });
    });

  }

  handleSubmit = () => {
    this.noteForm.submit();
  }

  handleCancel = () => {
    this.props.onCancel();
  }

  handleViewAuthor = (author, e) => {
    e.preventDefault();
    this.context.dispatch(pushRoute(routes.person.view, {personId: author.get('_id')}));
  }

  render(){
    const styles={
      container:{
        height: '100%',
      },
      header:{
        display: 'flex',
        justifyContent: 'space-between',
      },
      left:{
        display: 'flex',
        alignItems: 'center',
      },
      right:{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
    }

    const avatar = (person) => {
      if(!person)return <div/>
      return (
        <div>
          <a href="#" onClick={this.handleViewAuthor.bind(null, person)}>
            <AvatarView obj={person} size={24} label={`Wrote by ${person.get('name')}`}/>
          </a>
        </div>
      )
    }

    const time = () =>{
      const createdAt = this.props.note ? this.props.note.get('createdAt') : moment();
      return (
        <div style={styles.time} >
          {createdAt.format("dddd, MMMM Do YYYY")}
        </div>
      )
    }

    let submitBtn = <UpdateBtn
      onSubmit={this.handleSubmit}
      canSubmit={this.state.canSubmit && this.state.hasBeenModified}
      label={this.props.note ? 'Update' : 'Create'}
      size={"small"}/>;

    let cancelBtn = <CancelBtn
      onCancel={this.handleCancel}
      size={'small'}/>;


    return (
      <div className="form-control" style={styles.container} >
        <div style={styles.header}>
          <div style={styles.left}>
            {avatar(this.props.author)}
            {time()}
          </div>
          <div style={styles.right}>
            {submitBtn}
            {cancelBtn}
          </div>
        </div>
        <MarkdownEditField focused={true} field={this.noteForm.field('content')}/>
      </div>
    )
  }
}

Note.propTypes = {
  note: PropTypes.object,
  author: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
}


@authable
export class ViewNote extends Component{
  state = {editable: false}

  handleViewAuthor = (author, e) => {
    e.preventDefault();
    this.context.dispatch(pushRoute(routes.person.view, {personId: author.get('_id')}));
  }

  handleMouseEnter = (e) => {
    this.setState({editable: true})
  }

  handleMouseLeave = (e) => {
    this.setState({editable: false})
  }

  render(){
    const {mode, note, persons, entity, onCancel, onDelele, onEdit} = this.props;
    const md = new Remarkable();
    const text = {__html: md.render(note.get('content'))};

    const styles = {
      content:{
        height: '100%',
        minHeight: '36px',
        zIndex: 1,
      },
      note:{
        position: 'relative',
        zIndex: 0,
      },
      deletePanel:{
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
      container:{
        height: '100%',
      },
      time: {
        fontSize: '.7rem',
        fontStyle: 'italic',
        display: 'block',
        //float: 'right',
      },
      header:{
        display: 'flex',
        justifyContent: 'space-between',
      },
      left:{
        display: 'flex',
        alignItems: 'center',
      },
      right:{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
    }


    const avatar = (person) => {
      if(!person)return <div/>
      return (
        <div>
          <a href="#" onClick={this.handleViewAuthor.bind(null, person)}>
            <AvatarView obj={person} size={24} label={`Wrote by ${person.get('name')}`}/>
          </a>
        </div>
      )
    }

    const time = () =>{
      return (
        <div style={styles.time} >
          {note.get('createdAt').format("dddd, MMMM Do YYYY")}
        </div>
      )
    }

    const del = () => {
      const handleClick = (e) => {
        e.preventDefault();
        onDelele();
      }
      if(!this.state.editable || mode === 'delete')return;
      return (
        <a href="#" onClick={handleClick}>
          <i className="iconButton fa fa-trash m-r-1"/>
        </a>
      )
    }

    const edit = () => {
      const handleClick = (e) => {
        e.preventDefault();
        onEdit();
      }
      if(!this.state.editable || mode === 'delete')return;
      return (
        <a href="#" onClick={handleClick}>
          <i className="iconButton fa fa-pencil m-r-1"/>
        </a>
      )
    }

    const header = () => {
      const author = persons && persons.get(note.get('authorId'));
      return (
        <div style={styles.header} className="p-b-1">
          <div style={styles.left}>
            {avatar(author)}
            {time()}
          </div>
          <div style={styles.right}>
            {edit()}
            {del()}
          </div>
        </div>
      )
    }

    const deletePanel = () => {
      if(mode !== 'delete')return;
      const handleDelete = (e) => {
        e.preventDefault();
        onDelele();
      }
      const handleCancel = (e) => {
        e.preventDefault();
        onCancel();
      }
      return (
        <div style={styles.deletePanel}>
          <div>
            <button type="button" className="btn btn-danger m-l-1" onClick={handleDelete}>Delete</button>
          </div>
          <div>
            <button type="button" className="btn btn-warning m-l-1" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )
    }

    return (
      <div className="form-control" style={styles.container} onMouseOver={this.handleMouseEnter} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        {header()}
        <div style={styles.note}>
          <div ref={note.get('_id')} style={styles.content} dangerouslySetInnerHTML={text}/>
          {deletePanel()}
        </div>
      </div>
    )
  }
}

ViewNote.propTypes = {
  mode: PropTypes.string.isRequired,
  note: PropTypes.object.isRequired,
  persons: PropTypes.object.isRequired,
  entity: PropTypes.object,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
}

export default connect(notesSelector)(Notes);
