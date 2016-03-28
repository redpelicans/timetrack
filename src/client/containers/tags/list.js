import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {pushRoute} from '../../actions/routes'

import routes from '../../routes'
import {visibleTagsSelector} from '../../selectors/tags'
import {tagListActions} from '../../actions/tagList'
import {personsActions} from '../../actions/persons'
import {companiesActions} from '../../actions/companies'
import {Content} from '../../components/layout';
import {Header, HeaderLeft, HeaderRight, Title, TitleIcon, Filter} from '../../components/widgets';
import TagList from '../../components/tags/tagList'

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

  render() {
    const {tagList, filter} = this.props
    return (
        <Content>
          <Header>
            <HeaderLeft>
              <TitleIcon icon={routes.tags.list.iconName} />
              <Title title='Tags' />
            </HeaderLeft>
            <HeaderRight>
              <Filter filter={filter} onReset={this.handleResetFilter} onChange={this.handleSearchFilter} />
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
}

export default connect(visibleTagsSelector)(ListTagsApp)
