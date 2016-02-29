import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {allNotesSelector} from '../../selectors/notes';
import {notesActions} from '../../actions/notes';
import {personsActions} from '../../actions/persons'
import {Content} from '../../components/layout';
import {AvatarView, Sort, FilterPreferred, Filter, Refresh, NewLabel, UpdatedLabel} from '../../components/widgets';
import {Header, HeaderLeft, HeaderRight, Title, TitleIcon} from '../../components/widgets';
import {ViewNote} from '../notes'
import routes from '../../routes';

// error Cannot find module
// import './notes.less'

class NotesList extends Component {

  componentWillMount() {
      this.props.dispatch(notesActions.load())
      this.props.dispatch(personsActions.load())
  }

  render() {

    const listNotes = (notes, persons) => {
      return (
        notes.map((note) => {
        return <ViewNote
          mode="view"
          className="note-list-item"
          key={note.get('_id')}
          note={note}
          persons={persons} />
        }).toSetSeq()
      )
    }

    const {notes, persons} = this.props;
    return (
      <Content>
        <Header>
          <HeaderLeft>
            <TitleIcon icon={routes.notes.list.iconName} />
            <Title title='Notes' />
          </HeaderLeft>
        </Header>
        <div>
          {listNotes(notes, persons)}
        </div>
      </Content>
    )
  }
}

export default connect(allNotesSelector)(NotesList);
