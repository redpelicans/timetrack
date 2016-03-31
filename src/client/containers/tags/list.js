import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {pushRoute} from '../../actions/routes'

import routes from '../../routes'
import {visibleTagsSelector} from '../../selectors/tags'
import {tagListActions} from '../../actions/tagList'
import {personsActions} from '../../actions/persons'
import {companiesActions} from '../../actions/companies'
import {Content} from '../../components/layout';
import {Header, HeaderLeft, HeaderRight, Title, TitleIcon, Filter, Sort} from '../../components/widgets';
import TagList from '../../components/tags/tagList'

const sortMenu = [
  {key: 'name', label: 'Sort Alphabeticaly'},
  {key: 'occurrences', label: 'Sort by occurences'},
];

class ListTagsApp extends Component {

  componentWillMount = () => {
    const {dispatch} = this.props
    dispatch(personsActions.load())
    dispatch(companiesActions.load())
  }

  onDetail = (label) => {
    this.props.dispatch(pushRoute(routes.tags.view, {label}))
  }

  handleSearchFilter = (filter) => {
    console.log('FFfilter =', filter)
    this.props.dispatch(tagListActions.filter(filter))
  }

  handleResetFilter = () => {
    this.props.dispatch(tagListActions.filter(""))
  }

  handleSort = (mode) => {
    console.log('dans handleSort')
    this.props.dispatch(tagListActions.sort(mode))
  }

  render() {
    const {tagList, filter, sortCond} = this.props
    return (
        <Content>
          <Header>
            <HeaderLeft>
              <TitleIcon icon={routes.tags.list.iconName} />
              <Title title='Tags' />
            </HeaderLeft>
            <HeaderRight>
              <Filter filter={filter} onReset={this.handleResetFilter} onChange={this.handleSearchFilter} />
              <Sort sortMenu={sortMenu} sortCond={sortCond} onClick={this.handleSort}/>
            </HeaderRight>
          </Header>
          <TagList tagList={tagList} onDetail={this.onDetail} />
        </Content>
    )
  }
}

ListTagsApp.propTypes = {
  tagList: PropTypes.array.isRequired,
  filter: PropTypes.string.isRequired,
  sortCond: PropTypes.object.isRequired,
}

export default connect(visibleTagsSelector)(ListTagsApp)
