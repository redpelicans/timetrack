import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {pushRoute} from '../../actions/routes'

import routes from '../../routes'
import {tagListSelector} from '../../selectors/tags'
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

  render() {
    const {tagList} = this.props
    return (
        <Content>
          <Header>
            <HeaderLeft>
              <TitleIcon icon={routes.tags.list.iconName} />
              <Title title='Tags' />
            </HeaderLeft>
          </Header>
          <TagList tagList={tagList} onDetail={this.onDetail} />
        </Content>
    )
  }
}

export default connect(tagListSelector)(ListTagsApp)
