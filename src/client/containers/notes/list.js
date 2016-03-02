import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {allNotesSelector} from '../../selectors/notes';
import {notesActions} from '../../actions/notes';
import {personsActions} from '../../actions/persons'
import {companiesActions} from '../../actions/companies'
import {missionsActions} from '../../actions/missions'
import {Content} from '../../components/layout';
import {AvatarView, Sort, FilterPreferred, Filter, Refresh, NewLabel, UpdatedLabel} from '../../components/widgets';
import {Header, HeaderLeft, HeaderRight, Title, TitleIcon} from '../../components/widgets';
import {ItemNote} from '../notes'
import routes from '../../routes';
import Masonry from 'react-masonry-component';

class NotesList extends Component {

  componentWillMount() {
      this.props.dispatch(notesActions.load())
      this.props.dispatch(personsActions.load())
      this.props.dispatch(companiesActions.load())
      this.props.dispatch(missionsActions.load())
  }

  render() {

    const listNotes = (notes, persons) => {
      return (
        notes.map((note) => {
          return  <ItemNote
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
        <Masonry>
          {listNotes(notes, persons)}
        </Masonry>
      </Content>
    )
  }
}

export default connect(allNotesSelector)(NotesList);
