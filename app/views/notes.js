import moment from 'moment';
import React, {Component} from 'react';
import reactMixin from 'react-mixin';
import { Lifecycle } from 'react-router';
import classNames from 'classnames';
import Immutable from 'immutable';
import routes from '../routes';
import {notesActions, notesStore} from '../models/notes';
import {personsActions, personsStore} from '../models/persons';
import {navActions} from '../models/nav';
import {loginStore} from '../models/login';
import noteForm from '../forms/note';
import {AvatarView, MarkdownText, UpdateBtn, CancelBtn} from './widgets';
import {MarkdownEditField} from './fields';
import Remarkable from 'remarkable';
import authManager from '../auths';

export default class Notes extends Component{
  state = {
    notes: Immutable.Map(),
    persons: Immutable.Map(),
    showAddNotePanel: false,
  }

  componentWillUnmount(){
    if(this.unsubscribeNotes)this.unsubscribeNotes();
    if(this.unsubscribePersons)this.unsubscribePersons();
  }

  componentWillMount(){
    this.unsubscribeNotes = notesStore.listen( state => {
      // TODO: to be optimized to avoid render if filtered notes do not change
      const notes = state.data.filter(note => note.get('entityId') === this.props.entity.get('_id'));
      const data = {notes};
      // if(this.state.showAddNotePanel === undefined) data.showAddNotePanel = !notes.size;
      //else if(notes.size === 0) data.showAddNotePanel = true;
      this.setState(data);
    }) 

    this.unsubscribePersons = personsStore.listen( state => {
      this.setState({persons: state.data});
    }) 

    personsActions.load();
    notesActions.load();
  }

  handleAddNote = (e) => {
    e.preventDefault();
    this.setState({showAddNotePanel: true});
  }

  render(){
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

    const label = this.props.label || 'Notes';
    const notes = this.state.notes.sort( (a,b) => a.get('createdAt') < b.get('createdAt')).map(note => {
      return (
        <Note 
          key={note.get('_id')} 
          note={note} 
          persons={this.state.persons}
          entity={this.props.entity}/>
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
        notesActions.create(newNote, this.props.entity.toJS());
      }

      return (
        <div style={styles.addNotePanel}>
          <EditNote 
            author={loginStore.getUser()}
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
        {notes}
      </fieldset>
    )
  }
}

//@reactMixin.decorate(Lifecycle)
class Note extends Component{
  state = {mode: 'view'};

  render(){
    const {note, persons, entity} = this.props;

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
        notesActions.update(note.toJS(), newNote);
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
        notesActions.delete(this.props.note.toJS());
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
    this.noteForm = this.props.note ? noteForm({content: this.props.note.get('content')}) : noteForm();
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
    navActions.push(routes.person.view, {personId: author.get('_id')});
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

    let submitBtn = <UpdateBtn onSubmit={this.handleSubmit} canSubmit={this.state.canSubmit && this.state.hasBeenModified}/>;
    let cancelBtn = <CancelBtn onCancel={this.handleCancel}/>;


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


class ViewNote extends Component{
  
  state = {editable: false}

  handleViewAuthor = (author, e) => {
    e.preventDefault();
    navActions.push(routes.person.view, {personId: author.get('_id')});
  }

  handleMouseEnter = (e) => {
    this.setState({editable: true})
  }

  handleMouseLeave = (e) => {
    this.setState({editable: false})
  }
   
  render(){
    const {note, persons, entity} = this.props;
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
        this.props.onDelele();
      }
      if(!this.state.editable || this.props.mode === 'delete')return;
      return (
        <a href="#" onClick={handleClick}>
          <i className="iconButton fa fa-trash m-r-1"/>
        </a>
      )
    }

    const edit = () => {
      const handleClick = (e) => {
        e.preventDefault();
        this.props.onEdit();
      }
      if(!this.state.editable || this.props.mode === 'delete')return;
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
      if(this.props.mode !== 'delete')return;
      const handleDelete = (e) => {
        e.preventDefault();
        this.props.onDelele();
      }
      const handleCancel = (e) => {
        e.preventDefault();
        this.props.onCancel();
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
