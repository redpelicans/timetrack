import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {visibleNotesSelector} from '../../selectors/notes';
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

const sortMenu = [
  {key: 'content', label: 'Sort Alphabeticaly'},
  {key: 'createdAt', label: 'Sort by creation date'},
  {key: 'updatedAt', label: 'Sort by updated date'},
];

class NotesList extends Component {

  state = {}

  componentWillMount = () => {
    this.props.dispatch(notesActions.load())
    this.props.dispatch(personsActions.load())
    this.props.dispatch(companiesActions.load())
    this.props.dispatch(missionsActions.load())
  }

  handleSort = (mode) => {
    this.props.dispatch(notesActions.sort(mode))
  }

  handleResetFilter = () => {
    this.props.dispatch(notesActions.filter(''))
  }

  handleSearchFilter = (filter) => {
    this.props.dispatch(notesActions.filter(filter))
    // Masonry hack for reloading layout on search
    this.masonry.layout()
  }

  render() {

    const {notes, persons, companies, missions, filter, sortCond} = this.props

    if (!notes || !persons || !companies || !missions) return <div />

    const listNotes = (notes, persons, companies, missions) => {
      return (
        notes.map((note) => {
          return  <ItemNote
                    key={note.get('_id')}
                    note={note}
                    persons={persons}
                    companies={companies}
                    missions={missions} />
        }).toSetSeq()
      )
    }

    const options = {
      transitionDuration: 0,
      gutter: 10,
    }

    return (
      <Content>
        <Header>
          <HeaderLeft>
            <TitleIcon icon={routes.notes.list.iconName} />
            <Title title='Notes' />
          </HeaderLeft>
          <HeaderRight>
            <Filter filter={filter} onReset={this.handleResetFilter} onChange={this.handleSearchFilter}/>
            <Sort sortMenu={sortMenu} sortCond={sortCond} onClick={this.handleSort}/>
          </HeaderRight>
        </Header>
        <Masonry
          ref={function(c) {if (c != null) this.masonry = c.masonry;}.bind(this)}
          options={options}>
            {listNotes(notes, persons, companies, missions)}
        </Masonry>
      </Content>
    )
  }
}

export default connect(visibleNotesSelector)(NotesList)
